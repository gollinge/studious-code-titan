import { CircleHelp } from 'lucide-react'
import type { AppMode } from '../types'

type TopNavProps = {
  mode: AppMode
  onChangeMode: (mode: AppMode) => void
  onHelp: () => void
}

export function TopNav({ mode, onChangeMode, onHelp }: TopNavProps) {
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
        <button
          type="button"
          className="icon-btn"
          onClick={onHelp}
          title="How to use this app"
          aria-label="Help"
        >
          <CircleHelp size={16} />
        </button>
      </nav>
    </header>
  )
}
