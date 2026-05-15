import type { AppMode } from '../types'

type TopNavProps = {
  mode: AppMode
  onChangeMode: (mode: AppMode) => void
}

export function TopNav({ mode, onChangeMode }: TopNavProps) {
  return (
    <header className="top-nav">
      <h1>Python Play Lab</h1>
      <nav>
        <button
          type="button"
          className={mode === 'lessons' ? 'active' : ''}
          onClick={() => onChangeMode('lessons')}
        >
          Lessons
        </button>
        <button
          type="button"
          className={mode === 'sandbox' ? 'active' : ''}
          onClick={() => onChangeMode('sandbox')}
        >
          Sandbox
        </button>
      </nav>
    </header>
  )
}
