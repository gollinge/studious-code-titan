import { keymap } from '@codemirror/view'
import { python } from '@codemirror/lang-python'
import CodeMirror from '@uiw/react-codemirror'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { lessons } from './data/lessons'
import { sandboxExamples } from './data/sandboxExamples'
import { TopNav } from './components/TopNav'
import { WelcomeModal } from './components/WelcomeModal'
import type { AppMode, ExecutionResponse } from './types'
import './App.css'

const LESSON_PROGRESS_KEY = 'python-play-lab.lesson.progress'
const SANDBOX_CODE_KEY = 'python-play-lab.sandbox.code'
const DEFAULT_SANDBOX_CODE = sandboxExamples[0].code
const apiBase = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

function App() {
  const [mode, setMode] = useState<AppMode>('lessons')
  const [showWelcome, setShowWelcome] = useState<boolean>(true)
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0].id)
  const [lessonCodeById, setLessonCodeById] = useState<Record<string, string>>(() => {
    return Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson.starterCode]))
  })
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const raw = localStorage.getItem(LESSON_PROGRESS_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  })
  const [sandboxCode, setSandboxCode] = useState<string>(() => {
    return localStorage.getItem(SANDBOX_CODE_KEY) ?? DEFAULT_SANDBOX_CODE
  })
  const [output, setOutput] = useState<ExecutionResponse | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [hintsRevealed, setHintsRevealed] = useState<Record<string, number>>({})
  const outputRef = useRef<HTMLPreElement | null>(null)

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0],
    [selectedLessonId],
  )

  // Reset revealed hints when switching lessons
  const handleSelectLesson = (id: string) => {
    setSelectedLessonId(id)
  }


  const currentCode = mode === 'lessons' ? lessonCodeById[selectedLesson.id] ?? '' : sandboxCode

  useEffect(() => {
    localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(completedLessonIds))
  }, [completedLessonIds])

  useEffect(() => {
    localStorage.setItem(SANDBOX_CODE_KEY, sandboxCode)
  }, [sandboxCode])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  const updateCurrentCode = (code: string) => {
    if (mode === 'lessons') {
      setLessonCodeById((previous) => ({ ...previous, [selectedLesson.id]: code }))
      return
    }
    setSandboxCode(code)
  }

  const runCode = useCallback(async () => {
    setIsRunning(true)
    try {
      const response = await fetch(`${apiBase}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: currentCode }),
      })

      const payload = (await response.json()) as ExecutionResponse
      setOutput(payload)
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
    }
  }, [currentCode])

  const markLessonComplete = () => {
    if (!completedLessonIds.includes(selectedLesson.id)) {
      setCompletedLessonIds((existing) => [...existing, selectedLesson.id])
    }
  }

  const resetCode = () => {
    if (mode === 'lessons') {
      setLessonCodeById((previous) => ({ ...previous, [selectedLesson.id]: selectedLesson.starterCode }))
      return
    }
    setSandboxCode(DEFAULT_SANDBOX_CODE)
  }

  const keyboardShortcutExtension = useMemo(
    () =>
      keymap.of([
        {
          key: 'Mod-Enter',
          run: () => {
            void runCode()
            return true
          },
        },
      ]),
    [runCode],
  )

  return (
    <div className={`app ${mode === 'sandbox' ? 'sandbox-theme' : ''}`}>
      {showWelcome && (
        <WelcomeModal
          onDismiss={() => {
            setShowWelcome(false)
          }}
        />
      )}
      <TopNav mode={mode} onChangeMode={setMode} onHelp={() => setShowWelcome(true)} />
      <main className="panel-layout">
        <section className="panel panel-left">
          {mode === 'lessons' ? (
            <>
              <h2>Lessons</h2>
              <ul className="lesson-list">
                {lessons.map((lesson) => {
                  const isComplete = completedLessonIds.includes(lesson.id)
                  return (
                    <li key={lesson.id}>
                      <button
                        type="button"
                        className={lesson.id === selectedLesson.id ? 'active' : ''}
                        onClick={() => handleSelectLesson(lesson.id)}
                      >
                        {lesson.title} {isComplete ? '✓' : ''}
                      </button>
                    </li>
                  )
                })}
              </ul>
              <article className="instruction-card">
                <h3>{selectedLesson.title}</h3>
                <p>{selectedLesson.concept}</p>
                <h4>Goal</h4>
                <p>{selectedLesson.expectedOutput}</p>
                {selectedLesson.progressiveHints && selectedLesson.progressiveHints.length > 0 && (() => {
                  const revealed = hintsRevealed[selectedLesson.id] ?? 0
                  const hints = selectedLesson.progressiveHints
                  return (
                    <div className="hints-section">
                      <h4>Hints</h4>
                      {revealed > 0 && (
                        <ol>
                          {hints.slice(0, revealed).map((hint, i) => (
                            <li key={i}>
                              <pre className="hint-code">{hint}</pre>
                            </li>
                          ))}
                        </ol>
                      )}
                      {revealed < hints.length && (
                        <button
                          type="button"
                          className="secondary"
                          onClick={() =>
                            setHintsRevealed((prev) => ({
                              ...prev,
                              [selectedLesson.id]: revealed + 1,
                            }))
                          }
                        >
                          {revealed === 0 ? 'Show Hint' : revealed === hints.length - 1 ? 'Show Solution' : 'Next Hint'}
                        </button>
                      )}
                    </div>
                  )
                })()}
                {selectedLesson.challenge && (
                  <div className="challenge-section">
                    <h4>🚀 Dive Deeper</h4>
                    <p>{selectedLesson.challenge}</p>
                  </div>
                )}
                {selectedLesson.hints && selectedLesson.hints.length > 0 && !selectedLesson.progressiveHints && (
                  <>
                    <h4>Hints</h4>
                    <ul>
                      {selectedLesson.hints.map((hint) => (
                        <li key={hint}>{hint}</li>
                      ))}
                    </ul>
                  </>
                )}
                <button type="button" className="secondary" onClick={markLessonComplete}>
                  Mark Complete
                </button>
              </article>
            </>
          ) : (
            <>
              <h2>Sandbox Examples</h2>
              <p>Pick a starter, then experiment freely.</p>
              <ul className="lesson-list">
                {sandboxExamples.map((example) => (
                  <li key={example.id}>
                    <button type="button" onClick={() => setSandboxCode(example.code)}>
                      {example.title}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="panel panel-center">
          <div className="editor-toolbar">
            <button type="button" onClick={() => void runCode()} disabled={isRunning}>
              {isRunning ? 'Running...' : 'Run (Cmd/Ctrl + Enter)'}
            </button>
            <button type="button" className="secondary" onClick={resetCode}>
              Reset
            </button>
            <button type="button" className="secondary" onClick={() => setOutput(null)}>
              Clear Output
            </button>
          </div>
          <CodeMirror
            value={currentCode}
            height="100%"
            theme="light"
            extensions={[python(), keyboardShortcutExtension]}
            onChange={updateCurrentCode}
            basicSetup={{
              lineNumbers: true,
              foldGutter: false,
              autocompletion: true,
            }}
          />
        </section>

        <section className="panel panel-right">
          <h2>Output</h2>
          <pre ref={outputRef} className={`output ${output?.stderr ? 'error' : ''}`}>
            {output === null
              ? 'Run Python code to see output here.'
              : `${output.stdout}${output.stderr ? `\n${output.stderr}` : ''}`.trim() || '(no output)'}
          </pre>
          {output?.timed_out && <p className="timeout">Execution stopped after 2 seconds.</p>}
        </section>
      </main>
    </div>
  )
}

export default App
