/**
 * curriculum/loader.ts
 *
 * Statically imports all JSON curriculum files and exports fully-typed data.
 * This is the single entry point for all curriculum content — the app should
 * import from here, never directly from individual JSON files.
 */

import type { ModuleConfig, LessonConfig } from '../../types'

// ── Module metadata ───────────────────────────────────────────────────────────
import module1Json from './module1/module.json'
import module2Json from './module2/module.json'
import module3Json from './module3/module.json'

// ── Module 1 lesson configs ───────────────────────────────────────────────────
import lesson0aJson from './module1/lesson-0a.json'
import lesson0bJson from './module1/lesson-0b.json'
import lesson0cJson from './module1/lesson-0c.json'

// ── Module 2 lesson configs ───────────────────────────────────────────────────
import lesson1aJson from './module2/lesson-1a.json'
import lesson1bJson from './module2/lesson-1b.json'
import lesson1cJson from './module2/lesson-1c.json'
import lesson1dJson from './module2/lesson-1d.json'
import lesson2FinalJson from './module2/lesson-final.json'

// ── Module 3 lesson configs ───────────────────────────────────────────────────
import lesson2aJson from './module3/lesson-2a.json'
import lesson2bJson from './module3/lesson-2b.json'
import lesson2cJson from './module3/lesson-2c.json'
import lesson2dJson from './module3/lesson-2d.json'
import lesson3FinalJson from './module3/lesson-final.json'

// ── Typed exports ─────────────────────────────────────────────────────────────

export const modules: ModuleConfig[] = [
  module1Json as ModuleConfig,
  module2Json as ModuleConfig,
  module3Json as ModuleConfig,
]

export const readingLessonConfigs: LessonConfig[] = [
  lesson0aJson as LessonConfig,
  lesson0bJson as LessonConfig,
  lesson0cJson as LessonConfig,
]

export const codingLessonConfigs: LessonConfig[] = [
  lesson1aJson as LessonConfig,
  lesson1bJson as LessonConfig,
  lesson1cJson as LessonConfig,
  lesson1dJson as LessonConfig,
  lesson2FinalJson as LessonConfig,
  lesson2aJson as LessonConfig,
  lesson2bJson as LessonConfig,
  lesson2cJson as LessonConfig,
  lesson2dJson as LessonConfig,
  lesson3FinalJson as LessonConfig,
]

/** All lesson configs combined. */
export const allLessonConfigs: LessonConfig[] = [
  ...readingLessonConfigs,
  ...codingLessonConfigs,
]

/** Look up any lesson config by ID. */
export function getLesson(id: string): LessonConfig | undefined {
  return allLessonConfigs.find((l) => l.id === id)
}

/** Get all lesson configs for a given module. */
export function getModuleLessons(moduleId: string): LessonConfig[] {
  const mod = modules.find((m) => m.id === moduleId)
  if (!mod) return []
  return mod.lessonIds
    .map((id) => allLessonConfigs.find((l) => l.id === id))
    .filter((l): l is LessonConfig => l !== undefined)
}

// ── Legacy aliases (kept for backward compat during transition) ───────────────
/** @deprecated use getLesson() */
export function getReadingLesson(id: string): LessonConfig | undefined {
  return readingLessonConfigs.find((l) => l.id === id)
}
/** @deprecated use getModuleLessons() */
export function getModuleReadingLessons(moduleId: string): LessonConfig[] {
  return getModuleLessons(moduleId).filter((l) => l.type === 'reading')
}
