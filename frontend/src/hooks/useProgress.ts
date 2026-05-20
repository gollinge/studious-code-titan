import { useEffect, useState } from 'react'
import type { LessonStatus } from '../types'

const PROGRESS_KEY = 'studious-progress'

type ModuleProgress = Record<string, LessonStatus>
type ProgressState = Record<string, ModuleProgress>

function initialProgress(): ProgressState {
  return {
    module1: {
      'module1-lesson-1a': 'in-progress',
      'module1-lesson-1b': 'locked',
      'module1-lesson-1c': 'locked',
    },
    module2: {
      print: 'locked',
      variables: 'locked',
      math: 'locked',
      if: 'locked',
      loops: 'locked',
      functions: 'locked',
      lists: 'locked',
      turtle: 'locked',
    },
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY)
      if (raw) return JSON.parse(raw) as ProgressState
    } catch {
      // ignore parse errors — fall through to initial state
    }
    return initialProgress()
  })

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  }, [progress])

  const getStatus = (moduleId: string, lessonId: string): LessonStatus => {
    return progress[moduleId]?.[lessonId] ?? 'locked'
  }

  const markComplete = (
    moduleId: string,
    lessonId: string,
    orderedLessonIds: string[],
    nextModuleId?: string,
    nextModuleFirstLessonId?: string,
  ) => {
    setProgress((prev) => {
      const moduleProgress: ModuleProgress = { ...(prev[moduleId] ?? {}) }
      moduleProgress[lessonId] = 'complete'

      // Unlock the next lesson within this module
      const idx = orderedLessonIds.indexOf(lessonId)
      if (idx >= 0 && idx < orderedLessonIds.length - 1) {
        const nextId = orderedLessonIds[idx + 1]
        if ((moduleProgress[nextId] ?? 'locked') === 'locked') {
          moduleProgress[nextId] = 'in-progress'
        }
      }

      const next: ProgressState = { ...prev, [moduleId]: moduleProgress }

      // If all lessons in this module are now complete, unlock the next module
      const allComplete = orderedLessonIds.every((id) => moduleProgress[id] === 'complete')
      if (allComplete && nextModuleId && nextModuleFirstLessonId) {
        const nextModuleProgress: ModuleProgress = { ...(prev[nextModuleId] ?? {}) }
        if ((nextModuleProgress[nextModuleFirstLessonId] ?? 'locked') === 'locked') {
          nextModuleProgress[nextModuleFirstLessonId] = 'in-progress'
        }
        next[nextModuleId] = nextModuleProgress
      }

      return next
    })
  }

  const getModuleProgress = (moduleId: string, lessonIds: string[]) => {
    const moduleProgress = progress[moduleId] ?? {}
    const complete = lessonIds.filter((id) => moduleProgress[id] === 'complete').length
    return { complete, total: lessonIds.length }
  }

  return { getStatus, markComplete, getModuleProgress }
}
