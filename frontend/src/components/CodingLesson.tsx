import { EditorView } from '@codemirror/view'
import { python } from '@codemirror/lang-python'
import CodeMirror from '@uiw/react-codemirror'
import { useCallback, useRef, useState } from 'react'
import type { LessonConfig, ExecutionResponse, Step } from '../types'
import { CardReader } from './CardReader'
import { EditorHeader } from './EditorHeader'

// ── Friendly error messages ────────────────────────────────────────────────────

const ERROR_HELP: Record<string, string> = {
  SyntaxError:
    "Python couldn't understand this line. Check your quotes, parentheses, or spelling.",
  NameError:
    "Python doesn't recognise that name. Did you create the variable first?",
  IndentationError:
    'The spacing on this line looks off. Try using the Tab key to indent.',
  TypeError:
    "Two things are being mixed up that don't go together — like a number and a word.",
  ValueError:
    "The value you gave doesn't make sense in this context. Double-check what you passed in.",
  ConnectionError:
    "Couldn't reach the server. Make sure the backend is running.",
}

function getFriendlyHelp(errorType: string | null, timedOut: boolean): string | null {
  if (timedOut) return 'Your program ran for too long. Does it have a loop that never stops?'
  if (!errorType) return null
  return ERROR_HELP[errorType] ?? null
}

// ── Main component ─────────────────────────────────────────────────────────────

type Phase = 'cards' | 'editor' | 'dive-deeper'

type Props = {
  lesson: LessonConfig
  moduleTitle: string
  onComplete: () => void
  onNext: () => void
  onBack: () => void
}

const apiBase = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

export function CodingLesson({ lesson, moduleTitle, onComplete, onNext, onBack }: Props) {
  // Card phase state
  const [cardIndex, setCardIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('cards')
  const [isCompleted, setIsCompleted] = useState(false)

  // Editor state — steps[0].starterCode sets the initial editor content
  const initialCode = lesson.steps?.[0]?.starterCode ?? lesson.starterCode ?? ''
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<ExecutionResponse | null>(null)
  const [successCount, setSuccessCount] = useState(0)
  const [bonusMode, setBonusMode] = useState(false)
  const [bonusSuccessCount, setBonusSuccessCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [showHelp, setShowHelp] = useState(false)
  const [pendingInputs, setPendingInputs] = useState<{ prompts: string[]; values: string[] } | null>(null)
  const outputRef = useRef<HTMLPreElement | null>(null)

  const cards = lesson.content
  const hints = lesson.progressiveHints ?? []

  // Steps: new `steps[]` (Step objects) with fallback to legacy editorInstruction fields
  const steps: Step[] = lesson.steps
    ?? [lesson.editorInstruction, lesson.editorInstructionStep2]
        .filter((s): s is string => Boolean(s))
        .map((instruction) => ({ instruction }))

  // Bonus steps: new `bonusSteps[]` with fallback to legacy `challenge` string
  const bonusSteps: Step[] = lesson.bonusSteps
    ?? (lesson.challenge ? [{ instruction: lesson.challenge.replace(/^🚀 Dive Deeper: /, '') }] : [])

  const hasAllStepsDone = steps.length === 0 || successCount >= steps.length

  const bonusDone = bonusMode && bonusSuccessCount >= bonusSteps.length
  const hasBonusChallenge = bonusSteps.length > 0

  // (step transitions are purely instructional — code is additive, editor is not reset)

  const isLastCard = cardIndex === cards.length - 1

  // ── Card navigation ──────────────────────────────────────────────────────────

  const handleCardNext = () => {
    if (!isLastCard) {
      setCardIndex((i) => i + 1)
    } else {
      setPhase('editor')
    }
  }

  // ── Code execution ───────────────────────────────────────────────────────────

  const runCode = useCallback(async (stdin = '') => {
    setIsRunning(true)
    setShowHelp(false)
    setPendingInputs(null)
    try {
      const response = await fetch(`${apiBase}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, stdin }),
      })
      const payload = (await response.json()) as ExecutionResponse
      setOutput(payload)
      if (payload.error_type === null) {
        if (bonusMode) setBonusSuccessCount((n) => n + 1)
        else setSuccessCount((n) => n + 1)
      }
    } catch {
      setOutput({
        stdout: '',
        stderr: 'Could not connect to the server. Make sure the backend is running.',
        error_type: 'ConnectionError',
        timed_out: false,
        exit_code: null,
      })
    } finally {
      setIsRunning(false)
      setTimeout(() => {
        outputRef.current?.scrollTo(0, outputRef.current.scrollHeight)
      }, 50)
    }
  }, [code])

  // ── input() detection ────────────────────────────────────────────────────────

  function extractInputPrompts(src: string): string[] {
    const prompts: string[] = []
    const re = /\binput\(\s*(?:f?["'])(.*?)["']\s*\)/g
    let m: RegExpExecArray | null
    while ((m = re.exec(src)) !== null) {
      prompts.push(m[1])
    }
    // Also catch bare input() with no string arg
    const bareRe = /\binput\(\s*\)/g
    while ((bareRe.exec(src)) !== null) {
      prompts.push('Enter a value')
    }
    return prompts
  }

  function handleRunClick() {
    const prompts = extractInputPrompts(code)
    if (prompts.length > 0) {
      setPendingInputs({ prompts, values: prompts.map(() => '') })
    } else {
      void runCode()
    }
  }

  const resetCode = () => {
    // In bonus mode, reset to the bonus starter code; otherwise restore initial code
    const codeToRestore = bonusMode
      ? (bonusSteps[0]?.starterCode ?? '')
      : initialCode
    setCode(codeToRestore)
    setOutput(null)
    setHintsRevealed(0)
    setShowHelp(false)
  }

  // ── Bonus (challenge) mode — stays in the same editor, just swaps the instruction ──

  const startBonus = () => {
    setBonusMode(true)
    setHintsRevealed(0)
    setOutput(null)
    const first = bonusSteps[0]
    // bonusSteps[0].starterCode resets the editor to a fresh slate for the bonus
    if (first?.starterCode !== undefined) {
      setCode(first.starterCode)
    }
  }

  // ── Derived output display ───────────────────────────────────────────────────

  const hasError = Boolean(output?.stderr) || Boolean(output?.timed_out)
  const friendlyHelp = output ? getFriendlyHelp(output.error_type, output.timed_out) : null

  const outputText =
    output === null
      ? null
      : `${output.stdout}${output.stderr ? `\n${output.stderr}` : ''}`.trim() || '(no output)'

  // ── Cards phase ──────────────────────────────────────────────────────────────

  if (phase === 'cards') {
    return (
      <div className="coding-lesson coding-lesson--cards">
        <CardReader
          cards={cards}
          cardIndex={cardIndex}
          moduleTitle={moduleTitle}
          lessonTitle={lesson.title}
          nextLabel={isLastCard ? 'Try it →' : 'Next →'}
          onBack={onBack}
          onPrev={() => setCardIndex((i) => i - 1)}
          onNext={handleCardNext}
        />
      </div>
    )
  }

  // ── Editor phase ─────────────────────────────────────────────────────────────

  return (
    <div className="coding-lesson coding-lesson--editor">
      {/* Top bar: back + lesson title + step dots */}
      <header className="coding-lesson__topbar">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Module
        </button>
        <div className="coding-lesson__topbar-info">
          <span className="coding-lesson__topbar-module">{moduleTitle}</span>
          <span className="coding-lesson__topbar-title">{lesson.title}</span>
        </div>
        {steps.length > 0 && (
          <div className="step-dots">
            {steps.map((step, i) => {
              const done = i < successCount
              const active = i === successCount && !hasAllStepsDone
              return (
                <span
                  key={i}
                  className={`step-dot${done ? ' step-dot--done' : active ? ' step-dot--active' : ''}`}
                  title={step.instruction}
                />
              )
            })}
            {hasBonusChallenge && hasAllStepsDone && bonusSteps.map((step, i) => {
              const done = bonusMode && i < bonusSuccessCount
              const active = bonusMode && i === bonusSuccessCount && !bonusDone
              return (
                <span
                  key={`bonus-${i}`}
                  className={`step-dot step-dot--bonus${done ? ' step-dot--done' : active ? ' step-dot--active' : ''}`}
                  title={`🌟 ${step.instruction}`}
                />
              )
            })}
          </div>
        )}
      </header>

      {/* Editor + output row */}
      <div className="coding-lesson__workspace">

        {/* Left: compact instruction panel */}
        <aside className="coding-lesson__instruction-panel">
          {!bonusMode ? (
            <div className="step-list">
              {steps.slice(0, Math.min(successCount + 1, steps.length)).map((step, i) => {
                const isDone = i < successCount
                const isActive = i === successCount && !hasAllStepsDone
                return (
                  <div
                    key={i}
                    className={`step-card${isDone ? ' step-card--done' : ''}${isActive ? ' step-card--active' : ''}`}
                  >
                    <span className="step-label">
                      {isDone ? '✓ ' : ''}Step {i + 1}
                    </span>
                    <p className="step-text">{step.instruction}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="step-list">
              {bonusSteps.slice(0, Math.min(bonusSuccessCount + 1, bonusSteps.length)).map((step, i) => {
                const isDone = i < bonusSuccessCount
                const isActive = i === bonusSuccessCount && !bonusDone
                return (
                  <div
                    key={i}
                    className={`step-card step-card--bonus${isDone ? ' step-card--done' : ''}${isActive ? ' step-card--active' : ''}`}
                  >
                    <span className="step-label">
                      {isDone ? '✓ ' : '🌟 '}Challenge {bonusSteps.length > 1 ? i + 1 : ''}
                    </span>
                    <p className="step-text">{step.instruction}</p>
                  </div>
                )
              })}
            </div>
          )}
          {hintsRevealed > 0 && (
            <div className="editor-hint">
              <span className="editor-hint__label">💡 Hint {hintsRevealed}</span>
              <pre className="editor-hint__code">{hints[hintsRevealed - 1]}</pre>
            </div>
          )}
          {bonusDone ? (
            <div className="lesson-finish-area">
              <p className="lesson-finish-prompt">🌟 Bonus complete!</p>
              <div className="lesson-finish-actions">
                <button type="button" className="continue-btn" onClick={onNext}>
                  Next Lesson →
                </button>
              </div>
            </div>
          ) : hasAllStepsDone && !isCompleted ? (
            <div className="lesson-finish-area">
              <p className="lesson-finish-prompt">🎉 Nice work!</p>
              <div className="lesson-finish-actions">
                <button
                  type="button"
                  className="continue-btn"
                  onClick={() => { onComplete(); setIsCompleted(true); onNext() }}
                >
                  Next Lesson →
                </button>
                {hasBonusChallenge && (
                  <button
                    type="button"
                    className="dive-deeper-btn"
                    onClick={() => { onComplete(); setIsCompleted(true); startBonus() }}
                  >
                    🚀 Challenge
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </aside>

        {/* Center: editor zone with dark header */}
        <div className="coding-lesson__editor-zone">
          <EditorHeader
            isRunning={isRunning}
            onRun={handleRunClick}
            hint={hints.length > 0 && hintsRevealed < hints.length ? {
              label: hintsRevealed === 0 ? '💡 Hint' : hintsRevealed === hints.length - 1 ? 'Solution' : 'Next Hint',
              onClick: () => setHintsRevealed((n) => n + 1),
            } : undefined}
            onReset={resetCode}
          />
          <CodeMirror
            value={code}
            height="100%"
            theme="light"
            extensions={[python(), EditorView.lineWrapping]}
            onChange={(val) => setCode(val)}
            basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: true }}
          />
        </div>

        {/* Right: output — only shown after first run */}
        {(output !== null || pendingInputs !== null) && (
          <section className="coding-lesson__output">
            <h2>Output</h2>
            {pendingInputs !== null && (
              <form
                className="input-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  void runCode(pendingInputs.values.join('\n') + '\n')
                }}
              >
                <p className="input-form__intro">Your program needs some answers first:</p>
                {pendingInputs.prompts.map((prompt, i) => (
                  <div key={i} className="input-form__field">
                    <label className="input-form__label">{prompt || `Input ${i + 1}`}</label>
                    <input
                      type="text"
                      className="input-form__input"
                      value={pendingInputs.values[i]}
                      autoFocus={i === 0}
                      onChange={(e) => {
                        const newValues = [...pendingInputs.values]
                        newValues[i] = e.target.value
                        setPendingInputs({ ...pendingInputs, values: newValues })
                      }}
                    />
                  </div>
                ))}
                <button type="submit" className="input-form__run-btn">
                  ▶ Run with my answers
                </button>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setPendingInputs(null)}
                >
                  Cancel
                </button>
              </form>
            )}
            {output !== null && (
              <>
                <pre
                  ref={outputRef}
                  className={`output ${hasError ? 'error' : 'success'}`}
                >
                  {outputText}
                </pre>
                {hasError && friendlyHelp && (
                  <div className="output-help">
                    <button
                      type="button"
                      className="output-help__toggle"
                      onClick={() => setShowHelp((v) => !v)}
                      aria-label="Help"
                    >
                      {showHelp ? '✕ Hide help' : '? Help'}
                    </button>
                    {showHelp && (
                      <p className="output-help__text">{friendlyHelp}</p>
                    )}
                  </div>
                )}
                {output.timed_out && (
                  <p className="timeout">⏱ Execution stopped after 2 seconds.</p>
                )}
              </>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
