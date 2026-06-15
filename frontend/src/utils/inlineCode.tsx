import type { ReactNode } from 'react'

// Lightweight inline-markdown parser for prose. Recognizes:
//   `code`     → <code class="content-card-inline-code">
//   **bold**   → <strong>
//   *italic*   → <em>
//
// Plain text between matches is emitted as-is. Mismatched / unclosed markers
// fall through literally. Backticks are matched before asterisks so code spans
// containing `*` (like `"#" * 3`) stay intact.
const TOKEN_RE = /`([^`]+)`|\*\*([^*]+?)\*\*|\*([^*\s][^*]*?)\*/g

export function renderInlineCode(text: string): ReactNode[] {
  const out: ReactNode[] = []
  let lastIndex = 0
  let key = 0
  let m: RegExpExecArray | null
  TOKEN_RE.lastIndex = 0
  while ((m = TOKEN_RE.exec(text)) !== null) {
    if (m.index > lastIndex) {
      out.push(text.slice(lastIndex, m.index))
    }
    if (m[1] !== undefined) {
      out.push(<code key={key++} className="content-card-inline-code">{m[1]}</code>)
    } else if (m[2] !== undefined) {
      out.push(<strong key={key++}>{m[2]}</strong>)
    } else if (m[3] !== undefined) {
      out.push(<em key={key++}>{m[3]}</em>)
    }
    lastIndex = TOKEN_RE.lastIndex
  }
  if (lastIndex < text.length) {
    out.push(text.slice(lastIndex))
  }
  return out
}
