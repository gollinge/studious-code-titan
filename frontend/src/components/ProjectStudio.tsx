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

import { python } from '@codemirror/lang-python'
import CodeMirror from '@uiw/react-codemirror'
import { EditorHeader } from './EditorHeader'
import { OutputPanel } from './OutputPanel'
import { ContentCardView } from './CardReader'
import { useCallback, useState } from 'react'
import type { LessonConfig, Milestone } from '../types'
import { usePythonRunner } from '../hooks/usePythonRunner'
import { extractInputPrompts } from '../utils/pythonUtils'

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  lesson: LessonConfig
  moduleTitle: string
  onComplete: () => void
  onNext: () => void
}


// ── Component ─────────────────────────────────────────────────────────────────

export function ProjectStudio({ lesson, onComplete, onNext }: Props) {
  const [code, setCode] = useState(lesson.starterCode ?? '')
  const [isCompleted, setIsCompleted] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showRemix, setShowRemix] = useState(false)

  // milestone tracking: set of completed milestone ids
  const [completedMilestones, setCompletedMilestones] = useState<Set<string>>(new Set())

  // input() support
  const [pendingInputs, setPendingInputs] = useState<string[]>([])
  const [inputValues, setInputValues] = useState<Record<number, string>>({})

  const milestones: Milestone[] = lesson.milestones ?? []
  const allMilestonesHit = milestones.length > 0 && completedMilestones.size === milestones.length

  // Detect milestones on the current code string.
  // `check` may be a string or an array of alternates (any-match).
  // `notCheck` (optional) excludes hits when any of its substrings are present —
  // used to keep loose checks like ` = ` from matching `==`.
  const detectMilestones = useCallback((currentCode: string) => {
    if (milestones.length === 0) return
    setCompletedMilestones((prev) => {
      const next = new Set(prev)
      for (const m of milestones) {
        const checks = Array.isArray(m.check) ? m.check : [m.check]
        if (!checks.some((c) => currentCode.includes(c))) continue
        const exclusions = m.notCheck
          ? Array.isArray(m.notCheck) ? m.notCheck : [m.notCheck]
          : []
        if (exclusions.some((c) => currentCode.includes(c))) continue
        next.add(m.id)
      }
      return next
    })
  }, [milestones])

  const { isRunning, output, outputRef, runCode } = usePythonRunner({
    code,
    onSuccess: () => {
      if (!isCompleted) {
        setIsCompleted(true)
        onComplete()
        if (allMilestonesHit) setShowRemix(true)
      }
    },
  })

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

  return (
    <div className="project-studio">
      {/* ── Left panel: brief + milestones + hints ── */}
      <aside className="studio-panel studio-panel--left">
        <div className="studio-title">
          <span className="studio-badge">🎨 Project</span>
          <h2>{lesson.title}</h2>
        </div>

        {/* Project brief from content cards — uses the shared ContentCardView
            so puzzle/runner/code/callout cards all render correctly here too. */}
        <div className="studio-brief">
          {lesson.content.map((card) => (
            <ContentCardView key={card.id} card={card} />
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
          extensions={[python()]}
          height="100%"
          style={{ flex: 1, overflow: 'hidden' }}
        />
      </section>

      {/* ── Right panel: output ── */}
      <aside className="studio-panel studio-panel--right">
        {/* Scrollable body: title + output */}
        <div className="panel__body">
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
            <OutputPanel
              output={output}
              outputRef={outputRef}
              helpToggle={false}
            />
          )}

          {!output && !pendingInputs.length && (
            <p className="output-empty">Run your code to see the output here.</p>
          )}
        </div>

        {/* Pinned footer: completion nav */}
        {isCompleted && (
          <div className="panel__footer">
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
