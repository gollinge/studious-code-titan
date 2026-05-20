import type { ModuleConfig, LessonStatus } from '../types'

export type LessonRow = {
  id: string
  title: string
  isReading: boolean
}

type Props = {
  module: ModuleConfig
  lessonRows: LessonRow[]
  getStatus: (lessonId: string) => LessonStatus
  onSelectLesson: (lessonId: string, isReading: boolean) => void
  onBack: () => void
}

function statusIcon(status: LessonStatus): string {
  if (status === 'complete') return '✅'
  if (status === 'in-progress') return '🔵'
  return '🔒'
}

export function ModuleDetail({ module, lessonRows, getStatus, onSelectLesson, onBack }: Props) {
  const currentLesson = lessonRows.find((l) => getStatus(l.id) === 'in-progress')
  const hasAnyProgress = lessonRows.some((l) => getStatus(l.id) !== 'locked')
  const ctaLabel = hasAnyProgress ? 'Continue' : 'Start'

  return (
    <div className="module-detail">
      <div className="module-detail-header">
        <button type="button" className="back-btn" onClick={onBack}>
          ← Modules
        </button>
        <h2 className="module-detail-title">{module.title}</h2>
        <p className="module-detail-goal">{module.goal}</p>
      </div>

      {currentLesson && (
        <button
          type="button"
          className="continue-btn"
          onClick={() => onSelectLesson(currentLesson.id, currentLesson.isReading)}
        >
          {ctaLabel}: {currentLesson.title} →
        </button>
      )}

      <ul className="module-lesson-list">
        {lessonRows.map((lesson) => {
          const status = getStatus(lesson.id)
          const isLocked = status === 'locked'
          return (
            <li key={lesson.id} className={`module-lesson-row${isLocked ? ' locked' : ''}`}>
              <button
                type="button"
                disabled={isLocked}
                onClick={() => onSelectLesson(lesson.id, lesson.isReading)}
              >
                <span className="lesson-status-icon">{statusIcon(status)}</span>
                <span className="lesson-row-title">{lesson.title}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
