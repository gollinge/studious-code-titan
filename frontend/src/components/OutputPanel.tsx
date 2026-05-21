import type { ExecutionResponse } from '../types'
import { getFriendlyHelp } from '../utils/pythonErrors'

type Props = {
  output: ExecutionResponse
  outputRef: React.RefObject<HTMLPreElement | null>
  /** CodingLesson style: show a toggle button. Default: true */
  helpToggle?: boolean
  showHelp?: boolean
  onToggleHelp?: () => void
}

export function OutputPanel({
  output,
  outputRef,
  helpToggle = true,
  showHelp = false,
  onToggleHelp,
}: Props) {
  const hasError = Boolean(output.stderr) || Boolean(output.timed_out)
  const friendlyHelp = getFriendlyHelp(output.error_type, output.timed_out)
  const outputText =
    `${output.stdout}${output.stderr ? `\n${output.stderr}` : ''}`.trim() || '(no output)'

  return (
    <>
      <pre ref={outputRef} className={`output ${hasError ? 'error' : 'success'}`}>
        {outputText}
      </pre>
      {hasError && friendlyHelp && (
        <div className="output-help">
          {helpToggle ? (
            <>
              <button
                type="button"
                className="output-help__toggle"
                onClick={onToggleHelp}
                aria-label="Help"
              >
                {showHelp ? '✕ Hide help' : '? Help'}
              </button>
              {showHelp && <p className="output-help__text">{friendlyHelp}</p>}
            </>
          ) : (
            <p className="output-help__text">{friendlyHelp}</p>
          )}
        </div>
      )}
      {output.timed_out && (
        <p className="timeout">⏱ Execution stopped after 2 seconds.</p>
      )}
    </>
  )
}
