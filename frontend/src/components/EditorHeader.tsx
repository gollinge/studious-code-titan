// ── EditorHeader ──────────────────────────────────────────────────────────────
// Shared dark toolbar rendered above the CodeMirror editor in both
// CodingLesson and ProjectStudio.

type EditorHeaderProps = {
  isRunning: boolean
  onRun: () => void
  /** If provided, a secondary Hint button is shown. */
  hint?: {
    label: string
    onClick: () => void
  }
  /** If provided, a tertiary Reset icon button is shown. */
  onReset?: () => void
}

export function EditorHeader({ isRunning, onRun, hint, onReset }: EditorHeaderProps) {
  return (
    <div className="editor-toolbar">
      <span className="editor-toolbar__label">Python</span>
      <div className="editor-toolbar__controls">
        {hint && (
          <button type="button" className="hint-btn" onClick={hint.onClick}>
            {hint.label}
          </button>
        )}
        {onReset && (
          <button type="button" className="reset-btn" onClick={onReset}>
            ↺ Reset
          </button>
        )}
        <button
          type="button"
          className="run-btn"
          onClick={onRun}
          disabled={isRunning}
        >
          {isRunning ? '⏳ Running…' : '▶ Run  ⌘↵'}
        </button>
      </div>
    </div>
  )
}
