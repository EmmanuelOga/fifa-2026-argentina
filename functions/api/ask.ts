/**
 * Cloudflare Pages Function — "Ask the research" chat endpoint.
 *
 * Grounds Claude in the compiled research corpus (functions/api/corpus.json, built
 * from the site's own content layer) and answers ONLY from it. Questions it cannot
 * answer are logged to a KV namespace so they feed the next research re-run.
 *
 * This runs in the Cloudflare Workers runtime, so it calls the Anthropic API over
 * raw fetch (the appropriate choice where the npm SDK isn't bundled).
 *
 * Bindings (set in the Cloudflare Pages project — see README "Deploy"):
 *   ANTHROPIC_API_KEY  (secret)   — required; without it the endpoint returns 503
 *                                    and the UI shows a graceful fallback.
 *   CHAT_MODEL         (var)      — optional; defaults to claude-opus-4-8.
 *   QUESTIONS          (KV)       — optional; unanswered questions are logged here.
 */
// @ts-ignore - JSON import is bundled by the Pages build
import corpus from './corpus.json';

interface Env {
  ANTHROPIC_API_KEY?: string;
  CHAT_MODEL?: string;
  QUESTIONS?: KVNamespace;
}

interface AskBody {
  question?: string;
  locale?: 'en' | 'es';
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

  const text = (corpus as Record<string, string>)[locale];
  const model = env.CHAT_MODEL || 'claude-opus-4-8';

  const system = [
    {
      type: 'text',
      text:
        (locale === 'es'
          ? 'Sos el asistente de "La Alegría", un sitio sobre el Mundial 2026 de Argentina. Respondé ÚNICAMENTE con la información del CORPUS de abajo. Reglas: respondé en español rioplatense, con tono cálido y honesto. Toda probabilidad es especulativa. Las acusaciones son acusaciones (H1 = arreglo, no probado; H2 = dinero, creíble; no las confundas). Nunca afirmes la culpabilidad de nadie. Si el corpus no alcanza para responder, poné answered=false y decilo con honestidad. Citá los títulos de las fuentes relevantes.'
          : 'You are the assistant for "La Alegría", a site about Argentina\'s 2026 World Cup run. Answer ONLY from the CORPUS below. Rules: answer in English, warm and honest in tone. Every probability is speculative. Allegations are allegations (H1 = fixing, unproven; H2 = money, credible; do not conflate them). Never assert anyone\'s guilt. If the corpus is insufficient, set answered=false and say so honestly. Cite relevant source titles.') +
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

  // Log questions the corpus couldn't answer, for the next research re-run.
  if (!parsed.answered && env.QUESTIONS) {
    try {
      const key = `q:${new Date().toISOString()}:${crypto.randomUUID()}`;
      await env.QUESTIONS.put(key, JSON.stringify({ question, locale, at: Date.now() }));
    } catch {
      // logging is best-effort; never fail the request over it
    }
  }

  return json({ available: true, ...parsed });
};
