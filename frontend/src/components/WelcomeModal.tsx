type Props = {
  onDismiss: () => void
}

export function WelcomeModal({ onDismiss }: Props) {
  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
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
        <button type="button" className="modal-cta" onClick={onDismiss}>
          Let's go!
        </button>
      </div>
    </div>
  )
}
