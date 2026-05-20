import { keymap, EditorView } from '@codemirror/view'
import { python } from '@codemirror/lang-python'
import CodeMirror from '@uiw/react-codemirror'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { LessonConfig, ExecutionResponse, Step } from '../types'
import { CardReader } from './CardReader'

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

  // Editor state — step 0's editorPrompt/starterCode takes precedence over lesson-level fields
  const step0 = lesson.steps?.[0]
  const initialCode = [
    (step0?.editorPrompt ?? lesson.editorPrompt) ? `# ${step0?.editorPrompt ?? lesson.editorPrompt}` : '',
    step0?.starterCode ?? lesson.starterCode ?? '',
  ].filter(Boolean).join('\n')
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

  const currentStep = steps[successCount] ?? null
  const currentStepInstruction = currentStep?.instruction ?? null
  const hasAllStepsDone = steps.length === 0 || successCount >= steps.length

  const currentBonusStep = bonusSteps[bonusSuccessCount] ?? null
  const currentBonusInstruction = currentBonusStep?.instruction ?? null
  const bonusDone = bonusMode && bonusSuccessCount >= bonusSteps.length
  const hasBonusChallenge = bonusSteps.length > 0

  // Resets editor when a new step begins (if that step has its own editorPrompt/starterCode)
  useEffect(() => {
    if (successCount === 0) return
    const next = steps[successCount]
    if (!next?.editorPrompt && !next?.starterCode) return
    const newCode = [
      next.editorPrompt ? `# ${next.editorPrompt}` : '',
      next.starterCode ?? '',
    ].filter(Boolean).join('\n')
    setCode(newCode)
    setOutput(null)
  }, [successCount]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!bonusMode || bonusSuccessCount === 0) return
    const next = bonusSteps[bonusSuccessCount]
    if (!next?.editorPrompt && !next?.starterCode) return
    const newCode = [
      next.editorPrompt ? `# ${next.editorPrompt}` : '',
      next.starterCode ?? '',
    ].filter(Boolean).join('\n')
    setCode(newCode)
    setOutput(null)
  }, [bonusSuccessCount]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const keyboardShortcut = useMemo(
    () =>
      keymap.of([
        {
          key: 'Mod-Enter',
          run: () => {
            void handleRunClick()
            return true
          },
        },
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [code],
  )

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
    setCode(initialCode)
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
    if (first?.editorPrompt || first?.starterCode) {
      const newCode = [
        first.editorPrompt ? `# ${first.editorPrompt}` : '',
        first.starterCode ?? '',
      ].filter(Boolean).join('\n')
      setCode(newCode)
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
      {/* Left panel: compact progress */}
      <section className="coding-lesson__sidebar">
        <div className="coding-lesson__sidebar-header">
          <button type="button" className="back-btn" onClick={onBack}>
            ← Module
          </button>
        </div>

        {/* ── Compact progress panel ── */}
        <>
          <div className="lesson-progress-panel">
            <div className="lesson-goal">
              <span className="lesson-goal-label">{bonusMode ? 'Bonus' : 'Goal'}</span>
              <p className="lesson-goal-text">
                {bonusMode
                  ? (currentBonusInstruction ?? '🌟 Bonus complete!')
                  : (currentStepInstruction ?? lesson.editorPrompt ?? '')}
              </p>
            </div>

            {steps.length > 0 && (
              <ul className="concept-checklist">
                {steps.map((step, i) => {
                  const done = i < successCount
                  const active = i === successCount && !hasAllStepsDone
                  return (
                    <li key={i} className={`concept-item${active ? ' concept-item--active' : ''}`}>
                      <span className="concept-check">{done ? '✓' : active ? '→' : '○'}</span>
                      <span className="concept-title">{step.instruction}</span>
                    </li>
                  )
                })}
                {bonusSteps.length > 0 && bonusSteps.map((step, i) => {
                  if (!bonusMode && !hasAllStepsDone) return null
                  const done = bonusMode && i < bonusSuccessCount
                  const active = bonusMode && i === bonusSuccessCount && !bonusDone
                  return (
                    <li key={`bonus-${i}`} className={`concept-item concept-item--bonus${active ? ' concept-item--active' : ''}`}>
                      <span className="concept-check">{done ? '✓' : active ? '→' : '○'}</span>
                      <span className="concept-title">🌟 {step.instruction}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </>
      </section>

      {/* Center panel: editor */}
      <section className="coding-lesson__editor">
        {bonusMode && currentBonusInstruction ? (
          <div className="editor-instruction editor-instruction--bonus">
            {currentBonusInstruction}
          </div>
        ) : !bonusMode && currentStepInstruction ? (
          <div className="editor-instruction">
            {currentStepInstruction}
          </div>
        ) : null}
        {hintsRevealed > 0 && (
          <div className="editor-hint">
            <span className="editor-hint__label">💡 Hint {hintsRevealed}</span>
            <pre className="editor-hint__code">{hints[hintsRevealed - 1]}</pre>
          </div>
        )}
        {bonusDone ? (
          <div className="lesson-finish-area">
            <p className="lesson-finish-prompt">🌟 Bonus complete! Amazing work.</p>
            <div className="lesson-finish-actions">
              <button
                type="button"
                className="continue-btn"
                onClick={onNext}
              >
                Next Lesson →
              </button>
            </div>
          </div>
        ) : hasAllStepsDone && !isCompleted && (
          <div className="lesson-finish-area">
            <p className="lesson-finish-prompt">🎉 You did it! What's next?</p>
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
                  🚀 Try the Challenge
                </button>
              )}
            </div>
          </div>
        )}
        <div className="editor-toolbar">
          <button type="button" onClick={handleRunClick} disabled={isRunning}>
            {isRunning ? 'Running…' : '▶ Run'}
          </button>
          {hints.length > 0 && hintsRevealed < hints.length && (
            <button
              type="button"
              className="secondary"
              onClick={() => setHintsRevealed((n) => n + 1)}
            >
              {hintsRevealed === 0
                ? '💡 Hint'
                : hintsRevealed === hints.length - 1
                ? '💡 Solution'
                : '💡 Next Hint'}
            </button>
          )}
          <button type="button" className="secondary" onClick={resetCode}>
            ↺ Reset
          </button>
          <span className="editor-toolbar__shortcut">Cmd/Ctrl+Enter</span>
        </div>
        <CodeMirror
          value={code}
          height="100%"
          theme="light"
          extensions={[python(), keyboardShortcut, EditorView.lineWrapping]}
          onChange={(val) => setCode(val)}
          basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: true }}
        />
      </section>

      {/* Right panel: output — only shown after first run */}
      {(output !== null || pendingInputs !== null) && (
        <section className="coding-lesson__output">
          <h2>Output</h2>
          {pendingInputs !== null && (
            /* ── Input collection form ── */
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

              {/* Friendly error help */}
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
  )
}
