/**
 * ProjectStudio — full-screen coding environment for goal === 'project' lessons.
 *
 * Layout:
 *   Left panel  — project brief (content cards) + milestone checklist + hints + remix ideas
 *   Center panel — CodeMirror editor
 *   Right panel  — output + run controls
 *
 * Milestone detection runs on each Run: checks whether each milestone's `check`
 * string appears as a substring of the current editor code.
 */

import { keymap } from '@codemirror/view'
import { python } from '@codemirror/lang-python'
import CodeMirror from '@uiw/react-codemirror'
import { EditorHeader } from './EditorHeader'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { LessonConfig, ExecutionResponse, Milestone } from '../types'

// ── Friendly error messages (mirrored from CodingLesson) ─────────────────────

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

// ── input() detection ─────────────────────────────────────────────────────────

function extractInputPrompts(code: string): string[] {
  const re = /input\s*\(\s*(['"`])(.*?)\1\s*\)/g
  const prompts: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(code)) !== null) prompts.push(m[2])
  return prompts
}

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  lesson: LessonConfig
  moduleTitle: string
  onComplete: () => void
  onNext: () => void
  onBack: () => void
}

const apiBase = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

// ── Component ─────────────────────────────────────────────────────────────────

export function ProjectStudio({ lesson, moduleTitle, onComplete, onNext, onBack }: Props) {
  const [code, setCode] = useState(lesson.starterCode ?? '')
  const [output, setOutput] = useState<ExecutionResponse | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showRemix, setShowRemix] = useState(false)

  // milestone tracking: set of completed milestone ids
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set())

  // input() support
  const [pendingInputs, setPendingInputs] = useState<string[]>([])
  const [inputValues, setInputValues] = useState<Record<number, string>>({})

  const outputRef = useRef<HTMLPreElement | null>(null)

  const milestones: Milestone[] = lesson.milestones ?? []
  const allMilestonesHit = milestones.length > 0 && completedMilestones.size === milestones.length

  // Detect milestones on the current code string
  const detectMilestones = useCallback((currentCode: string) => {
    if (milestones.length === 0) return
    setCompletedMilestones((prev) => {
      const next = new Set(prev)
      for (const m of milestones) {
        if (currentCode.includes(m.check)) next.add(m.id)
      }
      return next
    })
  }, [milestones])

  const runCode = useCallback(async (stdin: string) => {
    setIsRunning(true)
    try {
      const response = await fetch(`${apiBase}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, stdin }),
      })
      const payload = (await response.json()) as ExecutionResponse
      setOutput(payload)

      // Detect milestones after each run
      detectMilestones(code)

      if (!isCompleted && payload.exit_code === 0) {
        setIsCompleted(true)
        onComplete()
        if (allMilestonesHit) setShowRemix(true)
      }
    } catch {
      setOutput({
        stdout: '',
        stderr: 'Could not connect to local backend. Start FastAPI server first.',
        error_type: 'ConnectionError',
        timed_out: false,
        exit_code: null,
      })
    } finally {
      setIsRunning(false)
      setTimeout(() => {
        if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
      }, 50)
    }
  }, [code, isCompleted, allMilestonesHit, detectMilestones, onComplete])

  const handleRun = () => {
    // Always re-detect milestones on Run even before execution
    detectMilestones(code)

    const prompts = extractInputPrompts(code)
    if (prompts.length > 0) {
      setPendingInputs(prompts)
      setInputValues({})
    } else {
      void runCode('')
    }
  }

  const handleSubmitInputs = () => {
    const stdin = pendingInputs.map((_, i) => inputValues[i] ?? '').join('\n')
    setPendingInputs([])
    setInputValues({})
    void runCode(stdin)
  }

  const studioKeymap = useMemo(
    () =>
      keymap.of([
        {
          key: 'Mod-Enter',
          run: () => {
            handleRun()
            return true
          },
        },
      ]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [code],
  )

  const friendlyHelp = output ? getFriendlyHelp(output.error_type, output.timed_out) : null
  const hasError = output && (output.stderr || output.timed_out)

  return (
    <div className="project-studio">
      {/* ── Left panel: brief + milestones + hints ── */}
      <aside className="studio-panel studio-panel--left">
        <button className="secondary studio-back-btn" onClick={onBack}>
          ← {moduleTitle}
        </button>

        <div className="studio-title">
          <span className="studio-badge">🎨 Project</span>
          <h2>{lesson.title}</h2>
        </div>

        {/* Project brief from content cards */}
        <div className="studio-brief">
          {lesson.content.map((card) => (
            <div key={card.id} className="studio-brief-card">
              {card.title && <h3 className="studio-brief-card__title">{card.title}</h3>}
              <p className="studio-brief-card__body" style={{ whiteSpace: 'pre-wrap' }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>

        {/* Milestones */}
        {milestones.length > 0 && (
          <div className="studio-milestones">
            <h3 className="studio-section-title">🏁 Milestones</h3>
            <ul className="milestone-list">
              {milestones.map((m) => {
                const done = completedMilestones.has(m.id)
                return (
                  <li key={m.id} className={`milestone-item ${done ? 'milestone-item--done' : ''}`}>
                    <span className="milestone-check">{done ? '✅' : '⬜'}</span>
                    <span className="milestone-label">{m.label}</span>
                  </li>
                )
              })}
            </ul>
            {allMilestonesHit && (
              <p className="milestone-complete-msg">🎉 All milestones hit! Amazing work!</p>
            )}
          </div>
        )}

        {/* Progressive hints */}
        {lesson.progressiveHints && lesson.progressiveHints.length > 0 && (
          <div className="studio-hints">
            <button
              className="studio-section-toggle"
              onClick={() => setShowHints((v) => !v)}
            >
              💡 Hints {showHints ? '▲' : '▼'}
            </button>
            {showHints && (
              <ol className="hint-list">
                {lesson.progressiveHints.map((hint, i) => (
                  <li key={i}>{hint}</li>
                ))}
              </ol>
            )}
          </div>
        )}

        {/* Remix ideas — revealed after completion */}
        {isCompleted && lesson.remixIdeas && lesson.remixIdeas.length > 0 && (
          <div className="studio-remix">
            <button
              className="studio-section-toggle studio-section-toggle--remix"
              onClick={() => setShowRemix((v) => !v)}
            >
              🎲 Remix Ideas {showRemix ? '▲' : '▼'}
            </button>
            {showRemix && (
              <ul className="remix-list">
                {lesson.remixIdeas.map((idea, i) => (
                  <li key={i}>{idea}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </aside>

      {/* ── Center panel: editor ── */}
      <section className="studio-panel studio-panel--editor">
        <EditorHeader isRunning={isRunning} onRun={handleRun} />

        <CodeMirror
          value={code}
          onChange={setCode}
          extensions={[python(), studioKeymap]}
          height="100%"
          style={{ flex: 1, overflow: 'hidden' }}
        />
      </section>

      {/* ── Right panel: output ── */}
      <aside className="studio-panel studio-panel--right">
        <h3 className="studio-section-title">Output</h3>

        {/* input() prompts */}
        {pendingInputs.length > 0 && (
          <div className="input-prompts">
            <p className="input-prompts__label">Your program needs some answers:</p>
            {pendingInputs.map((prompt, i) => (
              <div key={i} className="input-prompt-row">
                <label className="input-prompt-label">{prompt || `Input ${i + 1}`}</label>
                <input
                  className="input-prompt-field"
                  type="text"
                  value={inputValues[i] ?? ''}
                  onChange={(e) =>
                    setInputValues((prev) => ({ ...prev, [i]: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && i === pendingInputs.length - 1) handleSubmitInputs()
                  }}
                  autoFocus={i === 0}
                />
              </div>
            ))}
            <button className="run-btn" onClick={handleSubmitInputs}>
              Submit Answers ↵
            </button>
          </div>
        )}

        {output && (
          <>
            {hasError ? (
              <div className="output-error">
                <pre ref={outputRef} className="output-pre output-pre--error">
                  {output.timed_out
                    ? '⏱ Program timed out.'
                    : output.stderr || output.stdout}
                </pre>
                {friendlyHelp && (
                  <div className="friendly-help">
                    <strong>💡 Tip:</strong> {friendlyHelp}
                  </div>
                )}
              </div>
            ) : (
              <pre ref={outputRef} className="output-pre">
                {output.stdout || '(no output)'}
              </pre>
            )}
          </>
        )}

        {!output && !pendingInputs.length && (
          <p className="output-empty">Run your code to see the output here.</p>
        )}

        {/* Navigation */}
        {isCompleted && (
          <div className="studio-nav-actions">
            <p className="lesson-complete-msg">✨ Great project! Keep building!</p>
            <button className="primary" onClick={onNext}>
              Next Lesson →
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
