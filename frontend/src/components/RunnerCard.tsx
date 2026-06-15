import { usePythonRunner } from '../hooks/usePythonRunner'

type Props = {
  code: string
}

export function RunnerCard({ code }: Props) {
  const { isRunning, output, runCode } = usePythonRunner({ code })

  return (
    <div className="runner-card">
      <pre className="content-card-code"><code>{code}</code></pre>
      <button
        type="button"
        className="runner-card__run-btn"
        onClick={() => void runCode()}
        disabled={isRunning}
      >
        {isRunning ? 'Running…' : 'Run ▶'}
      </button>
      {output && (
        <pre className={`runner-card__output${output.error_type ? ' runner-card__output--error' : ''}`}>
          {output.stdout || output.stderr || '(no output)'}
        </pre>
      )}
    </div>
  )
}
