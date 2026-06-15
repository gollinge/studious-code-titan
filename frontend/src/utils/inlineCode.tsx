import type { ReactNode } from 'react'

// Split prose text on `backticks` so `print()` style spans render as inline code.
// Odd-indexed segments are the backtick-wrapped code.
export function renderInlineCode(text: string): ReactNode[] {
  return text.split(/`([^`]+)`/g).map((part, i) =>
    i % 2 === 1
      ? <code key={i} className="content-card-inline-code">{part}</code>
      : part,
  )
}
