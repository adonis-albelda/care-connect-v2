// Parses the limited HTML shape RichTextEditor actually produces (<p>,
// <ul><li>, plus inline <strong>/<em>/<u>/<a> which we flatten to plain text)
// into plain blocks — used to render the same rich-text fields into a PDF,
// which has no HTML renderer of its own.

export type QuotationBlock = { type: 'p'; text: string } | { type: 'ul'; items: string[] }

function stripTags(html: string) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

export function parseHtmlBlocks(html: string): QuotationBlock[] {
  const blocks: QuotationBlock[] = []
  const regex = /<ul[^>]*>([\s\S]*?)<\/ul>|<p[^>]*>([\s\S]*?)<\/p>/gi
  let match: RegExpExecArray | null

  while ((match = regex.exec(html))) {
    if (match[1] !== undefined) {
      const items = Array.from(match[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
        .map((m) => stripTags(m[1]))
        .filter(Boolean)
      if (items.length) blocks.push({ type: 'ul', items })
    } else if (match[2] !== undefined) {
      const text = stripTags(match[2])
      if (text) blocks.push({ type: 'p', text })
    }
  }

  // Fallback: no <p>/<ul> wrappers at all — treat the whole thing as one block.
  if (blocks.length === 0) {
    const text = stripTags(html)
    if (text) blocks.push({ type: 'p', text })
  }

  return blocks
}
