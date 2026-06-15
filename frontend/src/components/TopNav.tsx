import { CircleHelp } from 'lucide-react'
import { NavLink, useMatch, useNavigate } from 'react-router-dom'
import { modules, allLessonConfigs } from '../data/curriculum/loader'

type TopNavProps = {
  onHelp: () => void
}

type Crumb = {
  label: string
  to?: string
}

export function TopNav({ onHelp }: TopNavProps) {
  const navigate = useNavigate()
  const moduleMatch = useMatch('/modules/:moduleId')
  const lessonMatch = useMatch('/modules/:moduleId/lessons/:lessonId')

  const moduleId = lessonMatch?.params.moduleId ?? moduleMatch?.params.moduleId
  const lessonId = lessonMatch?.params.lessonId
  const module = moduleId ? modules.find((m) => m.id === moduleId) ?? null : null
  const lesson = lessonId ? allLessonConfigs.find((l) => l.id === lessonId) ?? null : null

  // Breadcrumb trail — ancestors only; last segment is the current view (non-link).
  const crumbs: Crumb[] = []
  if (moduleMatch || lessonMatch) {
    crumbs.push({ label: 'Modules', to: '/' })
    if (module) {
      crumbs.push({
        label: module.title,
        to: lessonMatch ? `/modules/${module.id}` : undefined,
      })
    }
    if (lesson) {
      crumbs.push({ label: lesson.title })
    }
  }

  return (
    <header className="top-nav">
      <h1>Python Play Lab</h1>

      <nav>
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Lessons
        </NavLink>
        <NavLink
          to="/sandbox"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Sandbox
        </NavLink>
        <button
          type="button"
          className="icon-btn"
          onClick={onHelp}
          title="How to use this app"
          aria-label="Help"
        >
          <CircleHelp size={16} />
        </button>
      </nav>

      {crumbs.length > 0 && (
        <nav className="top-nav__breadcrumbs" aria-label="Breadcrumb">
          <ol>
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1
              return (
                <li key={i} className={isLast ? 'is-current' : ''}>
                  {crumb.to && !isLast ? (
                    <button
                      type="button"
                      className="top-nav__crumb-link"
                      onClick={() => navigate(crumb.to!)}
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span aria-current={isLast ? 'page' : undefined}>{crumb.label}</span>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      )}
    </header>
  )
}
