import { useState } from 'react'
import { useProgress } from './hooks/useProgress'
import { useLessonNavigation } from './hooks/useLessonNavigation'
import { TopNav } from './components/TopNav'
import { WelcomeModal } from './components/WelcomeModal'
import { ModuleOverview } from './components/ModuleOverview'
import { ModuleDetail } from './components/ModuleDetail'
import { ReadingLesson } from './components/ReadingLesson'
import { CodingLesson } from './components/CodingLesson'
import { ProjectStudio } from './components/ProjectStudio'
import { SandboxView } from './components/SandboxView'
import { modules } from './data/curriculum/loader'
import type { AppMode } from './types'
import './App.css'

function App() {
  const [mode, setMode] = useState<AppMode>('lessons')
  const [showWelcome, setShowWelcome] = useState<boolean>(true)

  const { getStatus, markComplete, getModuleProgress } = useProgress()
  const {
    lessonView,
    activeModuleId,
    activeModule,
    activeLesson,
    lessonRowsForActiveModule,
    selectModule,
    selectLesson,
    completeLesson,
    goToNextLesson,
    goToModuleDetail,
    goHome,
  } = useLessonNavigation({ markComplete })

  const renderLessonView = () => {
    if (lessonView === 'home') {
      return (
        <div className="content-layout">
          <ModuleOverview
            modules={modules}
            getModuleProgress={getModuleProgress}
            getStatus={getStatus}
            onSelectModule={selectModule}
          />
        </div>
      )
    }

    if (lessonView === 'module-detail' && activeModule) {
      return (
        <div className="content-layout">
          <ModuleDetail
            module={activeModule}
            lessonRows={lessonRowsForActiveModule}
            getStatus={(lessonId) => getStatus(activeModuleId, lessonId)}
            onSelectLesson={selectLesson}
            onBack={goHome}
          />
        </div>
      )
    }

    if (lessonView === 'reading-lesson' && activeLesson) {
      return (
        <div className="content-layout">
          <ReadingLesson
            key={activeLesson.id}
            lesson={activeLesson}
            moduleTitle={activeModule?.title ?? ''}
            onComplete={() => completeLesson(activeLesson.id)}
            onNext={() => goToNextLesson(activeLesson.id)}
            onBack={goToModuleDetail}
          />
        </div>
      )
    }

    if (lessonView === 'coding-lesson' && activeLesson) {
      const LessonComponent = activeLesson.goal === 'project' ? ProjectStudio : CodingLesson
      return (
        <LessonComponent
          key={activeLesson.id}
          lesson={activeLesson}
          moduleTitle={activeModule?.title ?? ''}
          onComplete={() => completeLesson(activeLesson.id)}
          onNext={() => goToNextLesson(activeLesson.id)}
          onBack={goToModuleDetail}
        />
      )
    }

    return null
  }

  return (
    <div className={`app ${mode === 'sandbox' ? 'sandbox-theme' : ''}`}>
      {showWelcome && <WelcomeModal onDismiss={() => setShowWelcome(false)} />}
      <TopNav mode={mode} onChangeMode={setMode} onHelp={() => setShowWelcome(true)} />
      {mode === 'lessons' ? renderLessonView() : <SandboxView />}
    </div>
  )
}

export default App
