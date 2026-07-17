/**
 * Tiny, dependency-free, sanitizing Markdown renderer for chat answers.
 *
 * Threat model: the text comes from our own LLM endpoint, but we still treat it
 * as untrusted. Everything is HTML-escaped FIRST; markup is then rebuilt from
 * the escaped text, so no raw HTML can survive. Links only allow http(s).
 *
 * Supported (deliberately small): **bold**, *italic*, `code`, fenced code
 * blocks, [text](url), unordered (-, *) and ordered (1.) lists, paragraphs.
 * Headings degrade to bold paragraphs — a chat bubble has no room for <h2>.
 */

const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Inline markup on already-escaped text. */
function inline(s: string): string {
  return (
    s
      // `code` first so other markers inside it are left alone
      .replace(/`([^`\n]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>')
      // [text](http…): URL was escaped, so quotes can't break out of href
      .replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
  );
}

export function renderMarkdown(md: string): string {
  const out: string[] = [];
  // Normalize newlines; split out fenced code blocks first.
  const chunks = md.replace(/\r\n?/g, '\n').split(/```(?:[a-zA-Z0-9-]*)\n?/);

  chunks.forEach((chunk, i) => {
    if (i % 2 === 1) {
      // odd chunks are inside ``` fences
      out.push(`<pre><code>${escapeHtml(chunk.replace(/\n$/, ''))}</code></pre>`);
      return;
    }
    const lines = escapeHtml(chunk).split('\n');
    let list: 'ul' | 'ol' | null = null;
    let para: string[] = [];

    const closeList = () => {
      if (list) out.push(`</${list}>`);
      list = null;
    };
    const flushPara = () => {
      if (para.length) out.push(`<p>${inline(para.join('<br>'))}</p>`);
      para = [];
    };

    for (const raw of lines) {
      const line = raw.trimEnd();
      const ul = /^\s*[-*]\s+(.*)$/.exec(line);
      const ol = /^\s*\d+[.)]\s+(.*)$/.exec(line);
      const heading = /^#{1,4}\s+(.*)$/.exec(line);

      if (ul || ol) {
        flushPara();
        const kind = ul ? 'ul' : 'ol';
        if (list !== kind) {
          closeList();
          out.push(`<${kind}>`);
          list = kind;
        }
        out.push(`<li>${inline((ul ?? ol)![1]!)}</li>`);
      } else if (heading) {
        flushPara();
        closeList();
        out.push(`<p><strong>${inline(heading[1]!)}</strong></p>`);
      } else if (line.trim() === '') {
        flushPara();
        closeList();
      } else {
        closeList();
        para.push(line);
      }
    }
    flushPara();
    closeList();
  });

  return out.join('');
}

export { escapeHtml };
