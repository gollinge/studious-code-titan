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
import module4Json from './module4/module.json'
import module5Json from './module5/module.json'
import moduleCreative1Json from './module-creative-1/module.json'

// ── Module 1 lesson configs ───────────────────────────────────────────────────
import lesson1aJson from './module1/lesson-1a.json'
import lesson1bJson from './module1/lesson-1b.json'
import lesson1cJson from './module1/lesson-1c.json'
import lesson1dJson from './module1/lesson-1d.json'

// ── Module 2 lesson configs ───────────────────────────────────────────────────
import lesson2aJson from './module2/lesson-2a.json'
import lesson2bJson from './module2/lesson-2b.json'
import lesson2cJson from './module2/lesson-2c.json'
import lesson2dJson from './module2/lesson-2d.json'
import lesson2FinalJson from './module2/lesson-final.json'

// ── Module 3 lesson configs ───────────────────────────────────────────────────
import lesson3aJson from './module3/lesson-3a.json'
import lesson3bJson from './module3/lesson-3b.json'
import lesson3cJson from './module3/lesson-3c.json'
import lesson3dJson from './module3/lesson-3d.json'
import lesson3FinalJson from './module3/lesson-final.json'

// ── Module 4 lesson configs ───────────────────────────────────────────────────
import lesson4aJson from './module4/lesson-4a.json'
import lesson4bJson from './module4/lesson-4b.json'
import lesson4cJson from './module4/lesson-4c.json'
import lesson4dJson from './module4/lesson-4d.json'
import lesson4FinalJson from './module4/lesson-final.json'

// ── Module 5 lesson configs ───────────────────────────────────────────────────
import lesson5aJson from './module5/lesson-5a.json'
import lesson5bJson from './module5/lesson-5b.json'
import lesson5cJson from './module5/lesson-5c.json'
import lesson5dJson from './module5/lesson-5d.json'
import lesson5eJson from './module5/lesson-5e.json'
import lesson5FinalJson from './module5/lesson-final.json'

// ── Module Creative-1 lesson configs ─────────────────────────────────────────
import creativeTextAdventureJson from './module-creative-1/lesson-text-adventure.json'
import creativeQuizGameJson from './module-creative-1/lesson-quiz-game.json'
import creativePetSimulatorJson from './module-creative-1/lesson-pet-simulator.json'

// ── Typed exports ─────────────────────────────────────────────────────────────

export const modules: ModuleConfig[] = [
  module1Json as ModuleConfig,
  module2Json as ModuleConfig,
  module3Json as ModuleConfig,
  module4Json as ModuleConfig,
  module5Json as ModuleConfig,
  moduleCreative1Json as ModuleConfig,
]

export const readingLessonConfigs: LessonConfig[] = [
  lesson1aJson as LessonConfig,
  lesson1bJson as LessonConfig,
  lesson1cJson as LessonConfig,
  lesson1dJson as LessonConfig,
]

export const codingLessonConfigs: LessonConfig[] = [
  lesson2aJson as LessonConfig,
  lesson2bJson as LessonConfig,
  lesson2cJson as LessonConfig,
  lesson2dJson as LessonConfig,
  lesson2FinalJson as LessonConfig,
  lesson3aJson as LessonConfig,
  lesson3bJson as LessonConfig,
  lesson3cJson as LessonConfig,
  lesson3dJson as LessonConfig,
  lesson3FinalJson as LessonConfig,
  lesson4aJson as LessonConfig,
  lesson4bJson as LessonConfig,
  lesson4cJson as LessonConfig,
  lesson4dJson as LessonConfig,
  lesson4FinalJson as LessonConfig,
  lesson5aJson as LessonConfig,
  lesson5bJson as LessonConfig,
  lesson5cJson as LessonConfig,
  lesson5dJson as LessonConfig,
  lesson5eJson as LessonConfig,
  lesson5FinalJson as LessonConfig,
  creativeTextAdventureJson as LessonConfig,
  creativeQuizGameJson as LessonConfig,
  creativePetSimulatorJson as LessonConfig,
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
