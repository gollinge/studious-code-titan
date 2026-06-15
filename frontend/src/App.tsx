import { useState } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { useProgress } from './hooks/useProgress'
import { buildLessonRows, useLessonNavigation } from './hooks/useLessonNavigation'
import { TopNav } from './components/TopNav'
import { WelcomeModal } from './components/WelcomeModal'
import { ModuleOverview } from './components/ModuleOverview'
import { ModuleDetail } from './components/ModuleDetail'
import { ReadingLesson } from './components/ReadingLesson'
import { CodingLesson } from './components/CodingLesson'
import { ProjectStudio } from './components/ProjectStudio'
import { SandboxView } from './components/SandboxView'
import { modules, allLessonConfigs } from './data/curriculum/loader'
import type { LessonStatus } from './types'
import './App.css'

type ProgressApi = ReturnType<typeof useProgress>
type NavApi = ReturnType<typeof useLessonNavigation>

function App() {
  const [showWelcome, setShowWelcome] = useState<boolean>(true)
  const progress = useProgress()
  const nav = useLessonNavigation({ markComplete: progress.markComplete })

  const location = useLocation()
  const isSandbox = location.pathname.startsWith('/sandbox')

  return (
    <div className={`app ${isSandbox ? 'sandbox-theme' : ''}`}>
      {showWelcome && <WelcomeModal onDismiss={() => setShowWelcome(false)} />}
      <TopNav onHelp={() => setShowWelcome(true)} />

      <Routes>
        <Route path="/" element={<HomeRoute progress={progress} nav={nav} />} />
        <Route
          path="/modules/:moduleId"
          element={<ModuleRoute progress={progress} nav={nav} />}
        />
        <Route
          path="/modules/:moduleId/lessons/:lessonId"
          element={<LessonRoute progress={progress} nav={nav} />}
        />
        <Route path="/sandbox" element={<SandboxView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

// ── Route views ────────────────────────────────────────────────────────────────

function HomeRoute({ progress, nav }: { progress: ProgressApi; nav: NavApi }) {
  return (
    <div className="content-layout">
      <ModuleOverview
        modules={modules}
        getModuleProgress={progress.getModuleProgress}
        getStatus={progress.getStatus}
        onSelectModule={nav.selectModule}
      />
    </div>
  )
}

function ModuleRoute({ progress, nav }: { progress: ProgressApi; nav: NavApi }) {
  const { moduleId } = useParams<{ moduleId: string }>()
  const module = moduleId ? modules.find((m) => m.id === moduleId) : null

  if (!moduleId || !module) return <Navigate to="/" replace />

  return (
    <div className="content-layout">
      <ModuleDetail
        module={module}
        lessonRows={buildLessonRows(moduleId)}
        getStatus={(lessonId) => progress.getStatus(moduleId, lessonId)}
        onSelectLesson={(lessonId) => nav.selectLesson(moduleId, lessonId)}
      />
    </div>
  )
}

function LessonRoute({ progress, nav }: { progress: ProgressApi; nav: NavApi }) {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>()
  const module = moduleId ? modules.find((m) => m.id === moduleId) : null
  const lesson = lessonId ? allLessonConfigs.find((l) => l.id === lessonId) : null

  if (!moduleId || !lessonId || !module || !lesson) {
    return <Navigate to="/" replace />
  }

  // Enforce no-skip — locked lessons redirect back to module detail.
  const status: LessonStatus = progress.getStatus(moduleId, lessonId)
  if (status === 'locked') return <Navigate to={`/modules/${moduleId}`} replace />

  const commonProps = {
    key: lesson.id,
    lesson,
    moduleTitle: module.title,
    onComplete: () => nav.completeLesson(moduleId, lessonId),
    onNext: () => nav.goToNextLesson(moduleId, lessonId),
  }

  if (lesson.type === 'reading') {
    return (
      <div className="content-layout">
        <ReadingLesson {...commonProps} />
      </div>
    )
  }

  if (lesson.goal === 'project') {
    return <ProjectStudio {...commonProps} />
  }

  return <CodingLesson {...commonProps} />
}

export default App
