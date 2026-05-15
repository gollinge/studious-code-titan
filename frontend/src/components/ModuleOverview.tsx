import type { ModuleConfig, LessonStatus } from '../types'

type Props = {
  modules: ModuleConfig[]
  getModuleProgress: (moduleId: string, lessonIds: string[]) => { complete: number; total: number }
  getStatus: (moduleId: string, lessonId: string) => LessonStatus
  onSelectModule: (moduleId: string) => void
}

export function ModuleOverview({ modules, getModuleProgress, onSelectModule }: Props) {
  return (
    <div className="module-overview">
      <h2 className="module-overview-heading">Your Lessons</h2>
      <div className="module-list">
        {modules.map((mod, idx) => {
          const { complete, total } = getModuleProgress(mod.id, mod.lessonIds)
          const pct = total > 0 ? Math.round((complete / total) * 100) : 0
          const statusLabel =
            complete === 0 ? 'Not started' : complete === total ? 'Complete 🎉' : 'In progress'

          return (
            <button
              key={mod.id}
              type="button"
              className="module-card"
              onClick={() => onSelectModule(mod.id)}
            >
              <div className="module-card-header">
                <span className="module-number">Module {idx + 1}</span>
                <span className={`module-badge module-badge--${mod.type}`}>
                  {mod.type === 'reading' ? 'Reading' : 'Coding'}
                </span>
              </div>
              <h3 className="module-card-title">{mod.title}</h3>
              <p className="module-card-goal">{mod.goal}</p>
              <div className="module-progress-bar" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className="module-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <p className="module-progress-text">
                {complete} / {total} lessons · {statusLabel}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
