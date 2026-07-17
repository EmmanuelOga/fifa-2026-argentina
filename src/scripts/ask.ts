/**
 * Client runtime for the Ask-the-research chat. A small explicit state machine
 * (idle ⇄ pending) drives the UI: while a question is in flight the input,
 * send button and suggestion chips are disabled and an animated typing
 * indicator holds the answer's place. Answers render as sanitized Markdown
 * (see markdown.ts); citations render as source chips. Handles the endpoint
 * being unavailable (503/404 — e.g. a static-only deploy) gracefully.
 */
import { renderMarkdown, escapeHtml } from './markdown';

interface Config {
  endpoint: string;
  locale: 'en' | 'es';
  turnstileSiteKey?: string;
  labels: {
    thinking: string;
    unanswered: string;
    unavailable: string;
    error: string;
    rateLimited: string;
    sourcesLabel: string;
    youLabel: string;
    botLabel: string;
  };
}

/** Cloudflare Turnstile global, present once its api.js has loaded. */
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      getResponse: (widgetId: string) => string | undefined;
      reset: (widgetId: string) => void;
    };
  }
}

/** Load Turnstile and render an interaction-only widget; resolves to its id. */
function initTurnstile(container: HTMLElement, siteKey: string): Promise<string> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => {
      resolve(window.turnstile!.render(container, {
        sitekey: siteKey,
        appearance: 'interaction-only',
      }));
    };
    document.head.appendChild(script);
  });
}

export function initAsk(): void {
  document.querySelectorAll<HTMLElement>('[data-ask]').forEach(setup);
}

function setup(root: HTMLElement): void {
  const cfg = JSON.parse(
    root.querySelector<HTMLElement>('[data-config]')!.textContent || '{}',
  ) as Config;
  const log = root.querySelector<HTMLElement>('[data-log]')!;
  const form = root.querySelector<HTMLFormElement>('[data-form]')!;
  const input = root.querySelector<HTMLInputElement>('[data-input]')!;
  const send = root.querySelector<HTMLButtonElement>('[data-send]')!;
  const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('.chip'));

  // Optional bot protection: widget renders only when a site key is configured.
  let turnstileWidget: Promise<string> | undefined;
  const turnstileEl = root.querySelector<HTMLElement>('[data-turnstile]');
  if (cfg.turnstileSiteKey && turnstileEl) {
    turnstileWidget = initTurnstile(turnstileEl, cfg.turnstileSiteKey);
  }

  let state: 'idle' | 'pending' = 'idle';

  const setState = (next: 'idle' | 'pending') => {
    state = next;
    const busy = next === 'pending';
    input.disabled = busy;
    send.disabled = busy;
    chips.forEach((c) => (c.disabled = busy));
    root.classList.toggle('busy', busy);
    if (!busy) input.focus();
  };

  const label = (who: 'you' | 'bot') =>
    `<span class="who">${who === 'you' ? cfg.labels.youLabel : cfg.labels.botLabel}</span>`;

  const addMsg = (who: 'you' | 'bot', html: string, cls = '') => {
    const el = document.createElement('div');
    el.className = `msg ${who} ${cls}`.trim();
    el.innerHTML = `${label(who)}<div class="msg-body">${html}</div>`;
    log.appendChild(el);
    el.scrollIntoView({ block: 'nearest' });
    return el;
  };

  const finish = (pending: HTMLElement, html: string) => {
    pending.classList.remove('thinking');
    pending.innerHTML = `${label('bot')}<div class="msg-body">${html}</div>`;
    pending.scrollIntoView({ block: 'nearest' });
  };

  const thinkingHtml = `<span class="dots" aria-hidden="true"><i></i><i></i><i></i></span> ${escapeHtml(cfg.labels.thinking)}`;

  async function ask(question: string): Promise<void> {
    if (state === 'pending') return;
    setState('pending');
    addMsg('you', `<p>${escapeHtml(question)}</p>`);
    input.value = '';
    const pending = addMsg('bot', thinkingHtml, 'thinking');

    try {
      let turnstileToken: string | undefined;
      if (turnstileWidget) {
        const id = await turnstileWidget;
        turnstileToken = window.turnstile?.getResponse(id);
      }

      const res = await fetch(cfg.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question, locale: cfg.locale, turnstileToken }),
      });

      if (turnstileWidget) {
        // Tokens are single-use; ask Turnstile for a fresh one for the next question.
        window.turnstile?.reset(await turnstileWidget);
      }

      if (res.status === 503 || res.status === 404) {
        finish(pending, `<p>${escapeHtml(cfg.labels.unavailable)}</p>`);
        return;
      }
      if (res.status === 429) {
        finish(pending, `<p>${escapeHtml(cfg.labels.rateLimited)}</p>`);
        return;
      }
      if (!res.ok) throw new Error(String(res.status));

      const data = (await res.json()) as {
        available?: boolean;
        answer?: string;
        answered?: boolean;
        sources?: string[];
      };

      if (data.available === false) {
        finish(pending, `<p>${escapeHtml(cfg.labels.unavailable)}</p>`);
        return;
      }

      let html = data.answered
        ? renderMarkdown(data.answer || '')
        : `<p>${escapeHtml(cfg.labels.unanswered)}</p>`;
      if (data.answered && data.sources && data.sources.length) {
        html += `<div class="srcs"><span class="srcs-label">${escapeHtml(cfg.labels.sourcesLabel)}</span>${data.sources
          .map((s) => `<span class="src-chip">${escapeHtml(s)}</span>`)
          .join('')}</div>`;
      }
      finish(pending, html);
    } catch {
      finish(pending, `<p>${escapeHtml(cfg.labels.error)}</p>`);
    } finally {
      setState('idle');
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) ask(q);
  });
  chips.forEach((chip) =>
    chip.addEventListener('click', () => {
      ask(chip.dataset.q!);
    }),
  );
}
