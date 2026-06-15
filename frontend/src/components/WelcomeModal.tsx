import { useEffect, useRef } from 'react'

type Props = {
  onDismiss: () => void
}

export function WelcomeModal({ onDismiss }: Props) {
  const onDismissRef = useRef(onDismiss)
  useEffect(() => {
    onDismissRef.current = onDismiss
  }, [onDismiss])

  useEffect(() => {
    // Push a sentinel history entry so the browser back button closes this
    // modal instead of leaving the app. The popstate listener pops the entry
    // (browser already removed it) and calls onDismiss.
    window.history.pushState({ welcomeModal: true }, '')

    const handlePopState = () => onDismissRef.current()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') window.history.back()
    }

    window.addEventListener('popstate', handlePopState)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Trigger via history.back() so the Cmd-Click / button path and the browser
  // back-button path both unwind through the same popstate handler.
  const handleDismiss = () => window.history.back()

  return (
    <div className="modal-backdrop" onClick={handleDismiss}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="welcome-title">👋 Welcome to Python Play Lab!</h2>
        <p className="modal-intro">
          This is a place to learn Python by writing real code — right in your browser.
          Here's how it works:
        </p>
        <ul className="modal-features">
          <li>
            <span className="modal-icon">📖</span>
            <span>
              <strong>Lessons panel (left)</strong> — pick a lesson, read the concept, and follow along.
            </span>
          </li>
          <li>
            <span className="modal-icon">✏️</span>
            <span>
              <strong>Editor (middle)</strong> — type your Python code here. Press{' '}
              <kbd>Cmd/Ctrl + Enter</kbd> or click <strong>Run</strong> to execute it.
            </span>
          </li>
          <li>
            <span className="modal-icon">💬</span>
            <span>
              <strong>Output panel (right)</strong> — see what your code prints instantly.
            </span>
          </li>
          <li>
            <span className="modal-icon">💡</span>
            <span>
              <strong>Hints</strong> — stuck? Click <em>Show Hint</em> to reveal one clue at a time,
              all the way to the full solution.
            </span>
          </li>
          <li>
            <span className="modal-icon">🚀</span>
            <span>
              <strong>Dive Deeper</strong> — finished a lesson? Try the extra challenge at the bottom!
            </span>
          </li>
        </ul>
        <p className="modal-educator-note">
          <strong>Parents &amp; Educators:</strong> Module 1 is mostly reading — it
          builds the ideas before the typing. If your kid is impatient to write code,
          that's normal. You can come back to Module 1 anytime.
        </p>
        <button type="button" className="modal-cta" onClick={handleDismiss}>
          Let's go!
        </button>
      </div>
    </div>
  )
}
