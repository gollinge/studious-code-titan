import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { modules, allLessonConfigs } from '../data/curriculum/loader'
import type { LessonRow } from '../components/ModuleDetail'

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
  selectModule: (moduleId: string) => void
  selectLesson: (moduleId: string, lessonId: string) => void
  completeLesson: (moduleId: string, lessonId: string) => void
  goToNextLesson: (moduleId: string, lessonId: string) => void
  goToModuleDetail: (moduleId: string) => void
  goHome: () => void
}

export function buildLessonRows(moduleId: string): LessonRow[] {
  const mod = modules.find((m) => m.id === moduleId)
  if (!mod) return []
  return mod.lessonIds.map((id) => {
    const lesson = allLessonConfigs.find((l) => l.id === id)
    return { id, title: lesson?.title ?? id, isReading: lesson?.type === 'reading' }
  })
}

export function useLessonNavigation({ markComplete }: Options): Return {
  const navigate = useNavigate()

  const selectModule = useCallback(
    (moduleId: string) => navigate(`/modules/${moduleId}`),
    [navigate],
  )

  const selectLesson = useCallback(
    (moduleId: string, lessonId: string) =>
      navigate(`/modules/${moduleId}/lessons/${lessonId}`),
    [navigate],
  )

  const goToModuleDetail = useCallback(
    (moduleId: string) => navigate(`/modules/${moduleId}`),
    [navigate],
  )

  const goHome = useCallback(() => navigate('/'), [navigate])

  const completeLesson = useCallback(
    (moduleId: string, lessonId: string) => {
      const mod = modules.find((m) => m.id === moduleId)
      if (!mod) return
      const modIdx = modules.findIndex((m) => m.id === moduleId)
      const nextMod = modules[modIdx + 1]
      markComplete(moduleId, lessonId, mod.lessonIds, nextMod?.id, nextMod?.lessonIds[0])
    },
    [markComplete],
  )

  const goToNextLesson = useCallback(
    (moduleId: string, lessonId: string) => {
      const mod = modules.find((m) => m.id === moduleId)
      if (!mod) {
        navigate(`/modules/${moduleId}`)
        return
      }
      const idx = mod.lessonIds.indexOf(lessonId)
      const nextId =
        idx >= 0 && idx < mod.lessonIds.length - 1 ? mod.lessonIds[idx + 1] : null
      if (nextId) {
        navigate(`/modules/${moduleId}/lessons/${nextId}`)
        return
      }
      navigate(`/modules/${moduleId}`)
    },
    [navigate],
  )

  return {
    selectModule,
    selectLesson,
    completeLesson,
    goToNextLesson,
    goToModuleDetail,
    goHome,
  }
}
