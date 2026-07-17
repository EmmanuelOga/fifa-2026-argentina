/**
 * Shareable heading anchors: every h2 in the main content gets a stable id —
 * reusing an enclosing section/article id when there is one (e.g. #san-francisco,
 * blog post ids), else a slug of its own text — plus a 🔗 button that copies the
 * deep link. Buttons are injected at runtime, so they're styled from global.css
 * (.anchor-copy), not from any component's scoped styles.
 */

/** "¿Quién gana? — the numbers" → "quien-gana-the-numbers" */
function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function initHeadingAnchors(): void {
  const es = document.documentElement.lang === 'es';
  const t = {
    copy: es ? 'Copiar enlace a esta sección' : 'Copy link to this section',
    copied: es ? 'Enlace copiado' : 'Link copied',
  };

  const seen = new Set(
    Array.from(document.querySelectorAll('[id]')).map((n) => n.id),
  );

  document.querySelectorAll<HTMLHeadingElement>('main h2').forEach((h2) => {
    // Prefer the id of the section/article this heading titles.
    const host = h2.closest<HTMLElement>('section[id], article[id]');
    let id = host && host.querySelector('h2') === h2 ? host.id : h2.id;
    if (!id) {
      const base = slugify(h2.textContent ?? '') || 'section';
      id = base;
      for (let n = 2; seen.has(id); n++) id = `${base}-${n}`;
      seen.add(id);
      h2.id = id;
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'anchor-copy';
    btn.textContent = '🔗';
    btn.title = t.copy;
    btn.setAttribute('aria-label', t.copy);
    btn.addEventListener('click', async () => {
      const url = `${location.origin}${location.pathname}#${id}`;
      try {
        await navigator.clipboard.writeText(url);
      } catch {
        // Clipboard unavailable: at least put the anchor in the URL bar.
        location.hash = id;
      }
      btn.classList.add('copied');
      btn.textContent = '✓';
      btn.setAttribute('aria-label', t.copied);
      window.setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = '🔗';
        btn.setAttribute('aria-label', t.copy);
      }, 1600);
    });
    h2.append(btn);
  });
}
