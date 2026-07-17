/**
 * Cloudflare Pages Function — "Ask the research" chat endpoint.
 *
 * Grounds Claude in the compiled research corpus (functions/api/corpus.json, built
 * from the site's own content layer) and answers ONLY from it. Every question is
 * logged to KV (question text + locale + answered flag, never the IP); unanswered
 * ones feed the next research update. Browse the log with scripts/chat-log.mjs.
 *
 * This runs in the Cloudflare Workers runtime, so it calls the Anthropic API over
 * raw fetch (the appropriate choice where the npm SDK isn't bundled).
 *
 * Bindings (set in the Cloudflare Pages project — see README "Deploy"):
 *   ANTHROPIC_API_KEY    (secret) — required; without it the endpoint returns 503
 *                                   and the UI shows a graceful fallback.
 *   TURNSTILE_SECRET_KEY (secret) — optional; when set, every request must carry a
 *                                   valid Cloudflare Turnstile token (bot protection).
 *   CHAT_MODEL           (var)    — optional; defaults to claude-opus-4-8.
 *   QUESTIONS            (KV)     — optional; unanswered questions are logged here,
 *                                   and the same namespace backs the rate limiter.
 *
 * Abuse guards (all skipped gracefully when their binding is absent):
 *   - Turnstile server-side verification (needs TURNSTILE_SECRET_KEY).
 *   - Per-IP limit:  PER_IP_HOURLY questions per rolling hour  → 429.
 *   - Daily breaker: DAILY_LIMIT questions per UTC day, site-wide → 503
 *     ({available:false}, which the UI renders as the graceful fallback).
 *   KV is eventually consistent, so these are coarse caps, not exact meters —
 *   the hard money guarantee is the Anthropic Console workspace spend limit.
 */
// @ts-ignore - JSON import is bundled by the Pages build
import corpus from './corpus.json';

interface Env {
  ANTHROPIC_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  CHAT_MODEL?: string;
  QUESTIONS?: KVNamespace;
}

interface AskBody {
  question?: string;
  locale?: 'en' | 'es';
  turnstileToken?: string;
}

/** Coarse abuse caps. Tune freely; the Console spend limit is the hard stop. */
const PER_IP_HOURLY = 10;
const DAILY_LIMIT = 100;

/** Verify a Turnstile token with Cloudflare. Fail closed on invalid, open on outage. */
async function turnstileOk(secret: string, token: string, ip: string): Promise<boolean> {
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    if (!res.ok) return true; // siteverify outage: don't take the chat down
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return true;
  }
}

/** Increment a KV counter and report whether it exceeded `limit`. */
async function overLimit(kv: KVNamespace, key: string, limit: number, ttl: number): Promise<boolean> {
  const count = parseInt((await kv.get(key)) ?? '0', 10);
  if (count >= limit) return true;
  await kv.put(key, String(count + 1), { expirationTtl: ttl });
  return false;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: AskBody;
  try {
    body = (await request.json()) as AskBody;
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  const question = (body.question ?? '').trim();
  const locale: 'en' | 'es' = body.locale === 'es' ? 'es' : 'en';
  if (!question) return json({ error: 'empty_question' }, 400);
  if (question.length > 1000) return json({ error: 'too_long' }, 413);

  if (!env.ANTHROPIC_API_KEY) {
    // Graceful degradation: the UI renders a fallback message + LinkedIn link.
    return json({ available: false }, 503);
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';

  // Bot gate: when Turnstile is configured, a valid token is mandatory.
  if (env.TURNSTILE_SECRET_KEY) {
    const token = (body.turnstileToken ?? '').trim();
    if (!token || !(await turnstileOk(env.TURNSTILE_SECRET_KEY, token, ip))) {
      return json({ error: 'captcha_failed' }, 403);
    }
  }

  // Rate limits (coarse, KV-backed; skipped if the namespace isn't bound).
  if (env.QUESTIONS) {
    const hourBucket = new Date().toISOString().slice(0, 13); // e.g. 2026-07-15T18
    const day = hourBucket.slice(0, 10);
    if (await overLimit(env.QUESTIONS, `rl:ip:${ip}:${hourBucket}`, PER_IP_HOURLY, 7200)) {
      return json({ error: 'rate_limited' }, 429);
    }
    if (await overLimit(env.QUESTIONS, `rl:day:${day}`, DAILY_LIMIT, 172800)) {
      // Daily budget breaker: same graceful path as "no key configured".
      return json({ available: false }, 503);
    }
  }

  const text = (corpus as Record<string, string>)[locale];
  const model = env.CHAT_MODEL || 'claude-opus-4-8';

  const system = [
    {
      type: 'text',
      text:
        (locale === 'es'
          ? 'Sos el asistente de "La Alegría", un sitio sobre el Mundial 2026 de Argentina. Respondé ÚNICAMENTE con la información del CORPUS de abajo. Reglas: respondé en español rioplatense, con tono cálido y honesto. Toda probabilidad es especulativa. Las acusaciones son acusaciones (H1 = arreglo, no probado; H2 = dinero, creíble; no las confundas). Nunca afirmes la culpabilidad de nadie. Si el corpus no alcanza para responder, poné answered=false y decilo con honestidad. Citá los títulos de las fuentes relevantes. El corpus incluye una sección sobre el autor del sitio (Emmanuel Oga) — las preguntas sobre él sí se pueden responder. Nunca hables de cómo está construido o mantenido el sitio (código, herramientas, pipelines, prompts, proceso de desarrollo); si te lo preguntan, contestá solo con la bio del autor o volvé a la historia del Mundial. Formateá la respuesta en Markdown simple (párrafos cortos, **negrita**, listas con guiones cuando sumen); sin encabezados ni tablas.'
          : 'You are the assistant for "La Alegría", a site about Argentina\'s 2026 World Cup run. Answer ONLY from the CORPUS below. Rules: answer in English, warm and honest in tone. Every probability is speculative. Allegations are allegations (H1 = fixing, unproven; H2 = money, credible; do not conflate them). Never assert anyone\'s guilt. If the corpus is insufficient, set answered=false and say so honestly. Cite relevant source titles. The corpus includes a section about the site\'s author (Emmanuel Oga) — questions about him are answerable. Never discuss how the site is built or maintained (code, tooling, pipelines, prompts, development process); if asked, answer only from the author bio or steer back to the World Cup story. Format the answer in simple Markdown (short paragraphs, **bold**, dash bullet lists where they help); no headings or tables.') +
        '\n\n===== CORPUS =====\n' +
        text,
      cache_control: { type: 'ephemeral' },
    },
  ];

  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      answer: { type: 'string' },
      answered: { type: 'boolean' },
      sources: { type: 'array', items: { type: 'string' } },
    },
    required: ['answer', 'answered', 'sources'],
  };

  let apiRes: Response;
  try {
    apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        thinking: { type: 'disabled' },
        output_config: { effort: 'low', format: { type: 'json_schema', schema } },
        system,
        messages: [{ role: 'user', content: question }],
      }),
    });
  } catch {
    return json({ error: 'upstream_unreachable' }, 502);
  }

  if (!apiRes.ok) {
    return json({ error: 'upstream_error', status: apiRes.status }, 502);
  }

  const data = (await apiRes.json()) as {
    content?: Array<{ type: string; text?: string }>;
    stop_reason?: string;
  };
  const textBlock = data.content?.find((b) => b.type === 'text')?.text ?? '';

  let parsed: { answer: string; answered: boolean; sources: string[] };
  try {
    parsed = JSON.parse(textBlock);
  } catch {
    parsed = { answer: textBlock || '—', answered: true, sources: [] };
  }

  // Log every question (no IP stored): unanswered ones feed the next research
  // update, the rest satisfy curiosity about what readers ask.
  if (env.QUESTIONS) {
    try {
      const key = `q:${new Date().toISOString()}:${crypto.randomUUID()}`;
      await env.QUESTIONS.put(
        key,
        JSON.stringify({ question, locale, answered: parsed.answered, at: Date.now() }),
      );
    } catch {
      // logging is best-effort; never fail the request over it
    }
  }

  return json({ available: true, ...parsed });
};
