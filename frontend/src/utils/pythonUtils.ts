// Dev: Vite (5173) and FastAPI (8000) run separately. Production builds are
// served by the backend itself (see packaging/windows), so use the same origin.
export const apiBase =
  import.meta.env.VITE_API_BASE ?? (import.meta.env.DEV ? 'http://127.0.0.1:8000' : '')

/**
 * Scan `code` for `input(...)` calls and return the prompt strings.
 * Handles both quoted strings and bare `input()` (returns '' as prompt).
 */
export function extractInputPrompts(code: string): string[] {
  const prompts: string[] = []
  const re = /input\(\s*(?:(['"`])(.*?)\1)?\s*\)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(code)) !== null) {
    prompts.push(m[2] ?? '')
  }
  return prompts
}
