/**
 * Client runtime for the Ask-the-research chat. Posts questions to the Pages
 * Function and renders answers with citations. Handles the endpoint being
 * unavailable (503/404 — e.g. GitHub Pages fallback) with a graceful message.
 */
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

  // Optional bot protection: widget renders only when a site key is configured.
  let turnstileWidget: Promise<string> | undefined;
  const turnstileEl = root.querySelector<HTMLElement>('[data-turnstile]');
  if (cfg.turnstileSiteKey && turnstileEl) {
    turnstileWidget = initTurnstile(turnstileEl, cfg.turnstileSiteKey);
  }

  const esc = (s: string) =>
    s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

  const addMsg = (who: 'you' | 'bot', text: string, cls = '') => {
    const el = document.createElement('div');
    el.className = `msg ${who} ${cls}`.trim();
    const label = who === 'you' ? cfg.labels.youLabel : cfg.labels.botLabel;
    el.innerHTML = `<span class="who">${label}</span>${esc(text)}`;
    log.appendChild(el);
    el.scrollIntoView({ block: 'nearest' });
    return el;
  };

  async function ask(question: string): Promise<void> {
    addMsg('you', question);
    input.value = '';
    send.disabled = true;
    const pending = addMsg('bot', cfg.labels.thinking, 'thinking');

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
        pending.classList.remove('thinking');
        pending.innerHTML = `<span class="who">${cfg.labels.botLabel}</span>${esc(cfg.labels.unavailable)}`;
        return;
      }
      if (res.status === 429) {
        pending.classList.remove('thinking');
        pending.innerHTML = `<span class="who">${cfg.labels.botLabel}</span>${esc(cfg.labels.rateLimited)}`;
        return;
      }
      if (!res.ok) throw new Error(String(res.status));

      const data = (await res.json()) as {
        available?: boolean;
        answer?: string;
        answered?: boolean;
        sources?: string[];
      };
      pending.classList.remove('thinking');

      if (data.available === false) {
        pending.innerHTML = `<span class="who">${cfg.labels.botLabel}</span>${esc(cfg.labels.unavailable)}`;
        return;
      }
      const answer = data.answered ? data.answer || '' : cfg.labels.unanswered;
      let html = `<span class="who">${cfg.labels.botLabel}</span>${esc(answer)}`;
      if (data.answered && data.sources && data.sources.length) {
        html += `<div class="srcs">${cfg.labels.sourcesLabel}: ${data.sources.map(esc).join(' · ')}</div>`;
      }
      pending.innerHTML = html;
    } catch {
      pending.classList.remove('thinking');
      pending.innerHTML = `<span class="who">${cfg.labels.botLabel}</span>${esc(cfg.labels.error)}`;
    } finally {
      send.disabled = false;
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) ask(q);
  });
  root.querySelectorAll<HTMLButtonElement>('.chip').forEach((chip) =>
    chip.addEventListener('click', () => {
      const q = chip.dataset.q!;
      if (!send.disabled) ask(q);
    }),
  );
}
