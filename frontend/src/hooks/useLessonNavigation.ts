import { useCallback, useMemo, useState } from 'react'
import { modules, allLessonConfigs } from '../data/curriculum/loader'
import type { LessonConfig, ModuleConfig } from '../types'
import type { LessonRow } from '../components/ModuleDetail'

export type LessonView = 'home' | 'module-detail' | 'reading-lesson' | 'coding-lesson'

type MarkComplete = (
  moduleId: string,
  lessonId: string,
  orderedLessonIds: string[],
  nextModuleId?: string,
  nextModuleFirstLessonId?: string,
) => void

type Options = {
  markComplete: MarkComplete
}

type Return = {
  lessonView: LessonView
  activeModuleId: string
  activeModule: ModuleConfig | null
  activeLesson: LessonConfig | null
  lessonRowsForActiveModule: LessonRow[]
  selectModule: (moduleId: string) => void
  selectLesson: (lessonId: string, isReading: boolean) => void
  completeLesson: (lessonId: string) => void
  goToNextLesson: (lessonId: string) => void
  goToModuleDetail: () => void
  goHome: () => void
}

function buildLessonRows(moduleId: string): LessonRow[] {
  const mod = modules.find((m) => m.id === moduleId)
  if (!mod) return []
  return mod.lessonIds.map((id) => {
    const lesson = allLessonConfigs.find((l) => l.id === id)
    return { id, title: lesson?.title ?? id, isReading: lesson?.type === 'reading' }
  })
}

export function useLessonNavigation({ markComplete }: Options): Return {
  const [lessonView, setLessonView] = useState<LessonView>('home')
  const [activeModuleId, setActiveModuleId] = useState<string>('module1')
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null)

  const activeModule = useMemo(
    () => modules.find((m) => m.id === activeModuleId) ?? null,
    [activeModuleId],
  )

  const activeLesson = useMemo<LessonConfig | null>(
    () => (activeLessonId ? allLessonConfigs.find((l) => l.id === activeLessonId) ?? null : null),
    [activeLessonId],
  )

  const lessonRowsForActiveModule = useMemo(
    () => buildLessonRows(activeModuleId),
    [activeModuleId],
  )

  const selectModule = useCallback((moduleId: string) => {
    setActiveModuleId(moduleId)
    setLessonView('module-detail')
  }, [])

  const selectLesson = useCallback((lessonId: string, isReading: boolean) => {
    setActiveLessonId(lessonId)
    setLessonView(isReading ? 'reading-lesson' : 'coding-lesson')
  }, [])

  const completeLesson = useCallback(
    (lessonId: string) => {
      const mod = modules.find((m) => m.id === activeModuleId)
      if (!mod) return
      const modIdx = modules.findIndex((m) => m.id === activeModuleId)
      const nextMod = modules[modIdx + 1]
      markComplete(activeModuleId, lessonId, mod.lessonIds, nextMod?.id, nextMod?.lessonIds[0])
    },
    [activeModuleId, markComplete],
  )

  const goToModuleDetail = useCallback(() => setLessonView('module-detail'), [])
  const goHome = useCallback(() => setLessonView('home'), [])

  const goToNextLesson = useCallback(
    (lessonId: string) => {
      const mod = modules.find((m) => m.id === activeModuleId)
      if (!mod) {
        setLessonView('module-detail')
        return
      }
      const idx = mod.lessonIds.indexOf(lessonId)
      const nextId =
        idx >= 0 && idx < mod.lessonIds.length - 1 ? mod.lessonIds[idx + 1] : null
      if (nextId) {
        const next = allLessonConfigs.find((l) => l.id === nextId)
        if (next) {
          selectLesson(nextId, next.type === 'reading')
          return
        }
      }
      setLessonView('module-detail')
    },
    [activeModuleId, selectLesson],
  )

  return {
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
  }
}
