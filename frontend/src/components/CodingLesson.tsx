import { keymap, EditorView } from '@codemirror/view'
import { python } from '@codemirror/lang-python'
import CodeMirror from '@uiw/react-codemirror'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { LessonConfig, ExecutionResponse } from '../types'

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

// ── Content card renderer ──────────────────────────────────────────────────────

type CardProps = {
  card: LessonConfig['content'][number]
}

const PY_LINE = /^(\s+\S|(?:if|else|elif|for|while|def|class|import|from|return|pass|break|try|except|raise|with|print|input)\b|[a-zA-Z_]\w*\s*[=(+\[{])/

function isCodeParagraph(para: string): boolean {
  const lines = para.split('\n').filter((l) => l.trim() !== '')
  return lines.length > 0 && lines.every((l) => PY_LINE.test(l))
}

function CardBody({ body }: { body: string }) {
  const paragraphs = body.split(/\n\n+/)
  return (
    <>
      {paragraphs.map((para, i) =>
        isCodeParagraph(para) ? (
          <pre key={i} className="content-card__code"><code>{para}</code></pre>
        ) : (
          <p key={i} className="content-card__body" style={{ whiteSpace: 'pre-wrap' }}>{para}</p>
        )
      )}
    </>
  )
}

function ContentCardView({ card }: CardProps) {
  return (
    <div className={`content-card content-card--${card.type}`}>
      {card.title && <h3 className="content-card__title">{card.title}</h3>}
      <CardBody body={card.body} />
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

type Phase = 'cards' | 'editor' | 'dive-deeper'

type Props = {
  lesson: LessonConfig
  moduleTitle: string
  onComplete: () => void
  onBack: () => void
}

const apiBase = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

export function CodingLesson({ lesson, moduleTitle, onComplete, onBack }: Props) {
  // Card phase state
  const [cardIndex, setCardIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>('cards')

  // Editor state — starts with the objective as a comment; starter code is hint 0
  const initialCode = lesson.editorPrompt
    ? `# ${lesson.editorPrompt}\n`
    : ''
  const [code, setCode] = useState(initialCode)
  const [savedLessonCode, setSavedLessonCode] = useState<string | null>(null) // preserved when entering Dive Deeper
  const [output, setOutput] = useState<ExecutionResponse | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [showHelp, setShowHelp] = useState(false)
  const [pendingInputs, setPendingInputs] = useState<{ prompts: string[]; values: string[] } | null>(null)
  const outputRef = useRef<HTMLPreElement | null>(null)

  const cards = lesson.content
  // Prepend starter code as the first hint so the editor starts blank
  const hints = [
    ...(lesson.starterCode ? [`# Starter code\n${lesson.starterCode}`] : []),
    ...(lesson.progressiveHints ?? []),
  ]
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

  // ── Dive Deeper mode ─────────────────────────────────────────────────────────

  const challengePrompt = lesson.challenge
    ? `# 🚀 Dive Deeper\n# ${lesson.challenge.replace(/^🚀 Dive Deeper: /, '').replace(/\n/g, '\n# ')}\n`
    : ''

  const enterDiveDeeper = () => {
    setSavedLessonCode(code)
    setCode(challengePrompt)
    setOutput(null)
    setShowHelp(false)
    setPhase('dive-deeper')
  }

  const exitDiveDeeper = () => {
    setCode(savedLessonCode ?? initialCode)
    setOutput(null)
    setShowHelp(false)
    setPhase('editor')
  }

  // ── Derived output display ───────────────────────────────────────────────────

  const hasError = Boolean(output?.stderr) || Boolean(output?.timed_out)
  const friendlyHelp = output ? getFriendlyHelp(output.error_type, output.timed_out) : null

  const outputText =
    output === null
      ? null
      : `${output.stdout}${output.stderr ? `\n${output.stderr}` : ''}`.trim() || '(no output)'

  // ── Breadcrumb label ─────────────────────────────────────────────────────────

  const breadcrumb = `${moduleTitle} › ${lesson.title}`

  // ── Cards phase ──────────────────────────────────────────────────────────────

  if (phase === 'cards') {
    const currentCard = cards[cardIndex]
    return (
      <div className="coding-lesson coding-lesson--cards">
        <div className="reading-lesson__header">
          <button type="button" className="back-btn" onClick={onBack}>
            ← Module
          </button>
          <span className="reading-lesson__breadcrumb">{breadcrumb}</span>
          <span className="reading-lesson__progress">
            {cardIndex + 1} / {cards.length}
          </span>
        </div>

        <div className="card-reader">
          <ContentCardView card={currentCard} />
        </div>

        <div className="reading-lesson__nav">
          <button
            type="button"
            className="back-btn"
            onClick={() => setCardIndex((i) => i - 1)}
            disabled={cardIndex === 0}
          >
            ← Previous
          </button>
          <button type="button" className="continue-btn" onClick={handleCardNext}>
            {isLastCard ? 'Open Editor →' : 'Next →'}
          </button>
        </div>
      </div>
    )
  }

  // ── Editor phase (shared between 'editor' and 'dive-deeper') ─────────────────

  const isDivingDeeper = phase === 'dive-deeper'

  return (
    <div className={`coding-lesson coding-lesson--editor ${isDivingDeeper ? 'coding-lesson--challenge' : ''}`}>
      {/* Left panel: lesson info + hints */}
      <section className="coding-lesson__sidebar">
        <div className="coding-lesson__sidebar-header">
          {isDivingDeeper ? (
            <button type="button" className="back-btn" onClick={exitDiveDeeper}>
              ← Back to Lesson
            </button>
          ) : (
            <>
              <button type="button" className="back-btn" onClick={onBack}>
                ← Module
              </button>
              <button
                type="button"
                className="back-btn"
                onClick={() => { setPhase('cards'); setCardIndex(0) }}
              >
                ← Review Cards
              </button>
            </>
          )}
        </div>

        {isDivingDeeper ? (
          /* ── Dive Deeper sidebar ── */
          <div className="dive-deeper-sidebar">
            <div className="dive-deeper-badge">🚀 Dive Deeper</div>
            <p className="dive-deeper-description">
              {lesson.challenge?.replace(/^🚀 Dive Deeper: /, '')}
            </p>
            <p className="dive-deeper-note">
              Your lesson code is saved — press "← Back to Lesson" when you're done.
            </p>
          </div>
        ) : (
          /* ── Normal lesson sidebar ── */
          <>
            <h2 className="coding-lesson__title">{lesson.title}</h2>
            <p className="coding-lesson__breadcrumb">{moduleTitle}</p>

            {/* Summary of cards as quick reference */}
            <div className="coding-lesson__card-summary">
              {cards.map((card) => (
                <div key={card.id} className="coding-lesson__summary-card">
                  {card.title && <strong className="coding-lesson__summary-title">{card.title}</strong>}
                  {card.summary && <p className="coding-lesson__summary-text">{card.summary}</p>}
                </div>
              ))}
            </div>

            {/* Progressive hints */}
            {hints.length > 0 && (
              <div className="hints-section">
                <h4>Hints</h4>
                {hintsRevealed > 0 && (
                  <ol className="hints-list">
                    {hints.slice(0, hintsRevealed).map((hint, i) => (
                      <li key={i}>
                        <pre className="hint-code">{hint}</pre>
                      </li>
                    ))}
                  </ol>
                )}
                {hintsRevealed < hints.length && (
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => setHintsRevealed((n) => n + 1)}
                  >
                    {hintsRevealed === 0
                      ? 'Show Hint'
                      : hintsRevealed === hints.length - 1
                      ? 'Show Solution'
                      : 'Next Hint'}
                  </button>
                )}
              </div>
            )}

            {/* Dive Deeper button */}
            {lesson.challenge && (
              <button
                type="button"
                className="dive-deeper-btn"
                onClick={enterDiveDeeper}
              >
                🚀 Dive Deeper
              </button>
            )}
          </>
        )}

        <button type="button" className="continue-btn coding-lesson__complete-btn" onClick={onComplete}>
          Mark Complete ✓
        </button>
      </section>

      {/* Center panel: editor */}
      <section className="coding-lesson__editor">
        <div className="editor-toolbar">
          <button type="button" onClick={handleRunClick} disabled={isRunning}>
            {isRunning ? 'Running…' : '▶ Run'}
          </button>
          <button type="button" className="secondary" onClick={resetCode}>
            Reset
          </button>
          <button type="button" className="secondary" onClick={() => setOutput(null)}>
            Clear Output
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

      {/* Right panel: output */}
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
        {output === null && pendingInputs === null ? (
          <p className="output-placeholder">Run your code to see the output here.</p>
        ) : output !== null ? (
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
        ) : null}
      </section>
    </div>
  )
}
