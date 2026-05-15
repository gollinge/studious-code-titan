/**
 * curriculum/loader.ts
 *
 * Statically imports all JSON curriculum files and exports fully-typed data.
 * This is the single entry point for all curriculum content — the app should
 * import from here, never directly from individual JSON files.
 *
 * Module 2 coding lessons are still in ../lessons.ts (legacy) and referenced
 * by ID here. They will be migrated to JSON in a future pass.
 */

import type { ModuleConfig, LessonConfig } from '../../types'

// ── Module metadata ───────────────────────────────────────────────────────────
import module1Json from './module1/module.json'
import module2Json from './module2/module.json'

// ── Module 1 lesson configs ───────────────────────────────────────────────────
import lesson0aJson from './module1/lesson-0a.json'
import lesson0bJson from './module1/lesson-0b.json'
import lesson0cJson from './module1/lesson-0c.json'

// ── Typed exports ─────────────────────────────────────────────────────────────

export const modules: ModuleConfig[] = [
  module1Json as ModuleConfig,
  module2Json as ModuleConfig,
]

/** All reading lesson configs (Module 1). Coding lessons live in lessons.ts for now. */
export const readingLessonConfigs: LessonConfig[] = [
  lesson0aJson as LessonConfig,
  lesson0bJson as LessonConfig,
  lesson0cJson as LessonConfig,
]

/** Look up a reading lesson config by ID. */
export function getReadingLesson(id: string): LessonConfig | undefined {
  return readingLessonConfigs.find((l) => l.id === id)
}

/** Get all reading lesson configs for a given module. */
export function getModuleReadingLessons(moduleId: string): LessonConfig[] {
  const mod = modules.find((m) => m.id === moduleId)
  if (!mod) return []
  return mod.lessonIds
    .map((id) => readingLessonConfigs.find((l) => l.id === id))
    .filter((l): l is LessonConfig => l !== undefined)
}
