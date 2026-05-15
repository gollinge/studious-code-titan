import { keymap } from '@codemirror/view'
import { python } from '@codemirror/lang-python'
import CodeMirror from '@uiw/react-codemirror'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { sandboxExamples } from './data/sandboxExamples'
import { modules, allLessonConfigs } from './data/curriculum/loader'
import { useProgress } from './hooks/useProgress'
import { TopNav } from './components/TopNav'
import { WelcomeModal } from './components/WelcomeModal'
import { ModuleOverview } from './components/ModuleOverview'
import { ModuleDetail } from './components/ModuleDetail'
import type { LessonRow } from './components/ModuleDetail'
import { ReadingLesson } from './components/ReadingLesson'
import { CodingLesson } from './components/CodingLesson'
import type { AppMode, ExecutionResponse, LessonConfig } from './types'
import './App.css'

type LessonView = 'home' | 'module-detail' | 'reading-lesson' | 'coding-lesson'

const SANDBOX_CODE_KEY = 'python-play-lab.sandbox.code'
const DEFAULT_SANDBOX_CODE = sandboxExamples[0].code
const apiBase = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

function App() {
  const [mode, setMode] = useState<AppMode>('lessons')
  const [lessonView, setLessonView] = useState<LessonView>('home')
  const [activeModuleId, setActiveModuleId] = useState<string>('module1')
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState<boolean>(true)

  // Sandbox only
  const [sandboxCode, setSandboxCode] = useState<string>(() => {
    return localStorage.getItem(SANDBOX_CODE_KEY) ?? DEFAULT_SANDBOX_CODE
  })
  const [output, setOutput] = useState<ExecutionResponse | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const outputRef = useRef<HTMLPreElement | null>(null)

  const { getStatus, markComplete, getModuleProgress } = useProgress()

  const activeModule = modules.find((m) => m.id === activeModuleId) ?? null

  const activeLesson: LessonConfig | null = activeLessonId
    ? (allLessonConfigs.find((l) => l.id === activeLessonId) ?? null)
    : null

  const getLessonRowsForModule = (moduleId: string): LessonRow[] => {
    const mod = modules.find((m) => m.id === moduleId)
    if (!mod) return []
    return mod.lessonIds.map((id) => {
      const lesson = allLessonConfigs.find((l) => l.id === id)
      return { id, title: lesson?.title ?? id, isReading: lesson?.type === 'reading' }
    })
  }

  const handleSelectModule = (moduleId: string) => {
    setActiveModuleId(moduleId)
    setLessonView('module-detail')
  }

  const handleSelectLesson = (lessonId: string, isReading: boolean) => {
    setActiveLessonId(lessonId)
    setLessonView(isReading ? 'reading-lesson' : 'coding-lesson')
  }

  const handleLessonComplete = (lessonId: string) => {
    const mod = modules.find((m) => m.id === activeModuleId)
    if (!mod) return
    const modIdx = modules.findIndex((m) => m.id === activeModuleId)
    const nextMod = modules[modIdx + 1]
    markComplete(activeModuleId, lessonId, mod.lessonIds, nextMod?.id, nextMod?.lessonIds[0])
    // stay on the lesson — Next Lesson button handles navigation
  }

  const handleNextLesson = (lessonId: string) => {
    const mod = modules.find((m) => m.id === activeModuleId)
    if (!mod) { setLessonView('module-detail'); return }
    const idx = mod.lessonIds.indexOf(lessonId)
    const nextId = idx >= 0 && idx < mod.lessonIds.length - 1 ? mod.lessonIds[idx + 1] : null
    if (nextId) {
      const next = allLessonConfigs.find((l) => l.id === nextId)
      if (next) { handleSelectLesson(nextId, next.type === 'reading'); return }
    }
    setLessonView('module-detail')
  }

  useEffect(() => {
    localStorage.setItem(SANDBOX_CODE_KEY, sandboxCode)
  }, [sandboxCode])

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  // Sandbox run
  const runSandbox = useCallback(async () => {
    setIsRunning(true)
    try {
      const response = await fetch(`${apiBase}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: sandboxCode }),
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
  }, [sandboxCode])

  const sandboxKeymap = useMemo(
    () =>
      keymap.of([
        {
          key: 'Mod-Enter',
          run: () => {
            void runSandbox()
            return true
          },
        },
      ]),
    [runSandbox],
  )

  return (
    <div className={`app ${mode === 'sandbox' ? 'sandbox-theme' : ''}`}>
      {showWelcome && (
        <WelcomeModal onDismiss={() => setShowWelcome(false)} />
      )}
      <TopNav mode={mode} onChangeMode={setMode} onHelp={() => setShowWelcome(true)} />

      {/* ── Module Overview (home) ── */}
      {mode === 'lessons' && lessonView === 'home' && (
        <div className="content-layout">
          <ModuleOverview
            modules={modules}
            getModuleProgress={getModuleProgress}
            getStatus={getStatus}
            onSelectModule={handleSelectModule}
          />
        </div>
      )}

      {/* ── Module Detail ── */}
      {mode === 'lessons' && lessonView === 'module-detail' && activeModule && (
        <div className="content-layout">
          <ModuleDetail
            module={activeModule}
            lessonRows={getLessonRowsForModule(activeModuleId)}
            getStatus={(lessonId) => getStatus(activeModuleId, lessonId)}
            onSelectLesson={handleSelectLesson}
            onBack={() => setLessonView('home')}
          />
        </div>
      )}

      {/* ── Reading Lesson ── */}
      {mode === 'lessons' && lessonView === 'reading-lesson' && activeLesson && (
        <div className="content-layout">
          <ReadingLesson
            key={activeLesson.id}
            lesson={activeLesson}
            moduleTitle={activeModule?.title ?? ''}
            onComplete={() => handleLessonComplete(activeLesson.id)}
            onNext={() => handleNextLesson(activeLesson.id)}
            onBack={() => setLessonView('module-detail')}
          />
        </div>
      )}

      {/* ── Coding Lesson ── */}
      {mode === 'lessons' && lessonView === 'coding-lesson' && activeLesson && (
        <CodingLesson
          key={activeLesson.id}
          lesson={activeLesson}
          moduleTitle={activeModule?.title ?? ''}
          onComplete={() => handleLessonComplete(activeLesson.id)}
          onNext={() => handleNextLesson(activeLesson.id)}
          onBack={() => setLessonView('module-detail')}
        />
      )}

      {/* ── Sandbox (3-panel layout) ── */}
      {mode === 'sandbox' && (
        <main className="panel-layout">
          <section className="panel panel-left">
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
          </section>

          <section className="panel panel-center">
            <div className="editor-toolbar">
              <button type="button" onClick={() => void runSandbox()} disabled={isRunning}>
                {isRunning ? 'Running...' : 'Run (Cmd/Ctrl + Enter)'}
              </button>
              <button type="button" className="secondary" onClick={() => setSandboxCode(DEFAULT_SANDBOX_CODE)}>
                Reset
              </button>
              <button type="button" className="secondary" onClick={() => setOutput(null)}>
                Clear Output
              </button>
            </div>
            <CodeMirror
              value={sandboxCode}
              height="100%"
              theme="light"
              extensions={[python(), sandboxKeymap]}
              onChange={(val) => setSandboxCode(val)}
              basicSetup={{ lineNumbers: true, foldGutter: false, autocompletion: true }}
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
      )}
    </div>
  )
}

export default App
