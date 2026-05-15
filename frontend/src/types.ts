export type AppMode = 'lessons' | 'sandbox'

// ── Curriculum types ──────────────────────────────────────────────────────────

export type LessonType = 'reading' | 'coding'

export type ModuleType = 'reading' | 'coding'

/**
 * Describes the pedagogical intent of a lesson.
 * Used from Module 2 onwards to distinguish guided vs open-ended coding lessons.
 *
 * concept        — introduces a new idea; heavily guided, minimal free coding
 * guided-practice — student fills in scaffolded code with a clear expected output
 * open-practice  — student writes freely within a prompt; no single right answer
 * project        — multi-concept, open-ended, student-driven (used for practicals)
 */
export type LessonGoal = 'concept' | 'guided-practice' | 'open-practice' | 'project'

export type ContentCardType = 'text' | 'callout' | 'code'

export type ContentCard = {
  id: string
  type: ContentCardType
  title?: string
  body: string
}

export type QuizOption = {
  id: string
  text: string
}

export type QuizQuestion = {
  id: string
  type: 'multiple-choice' | 'true-false'
  question: string
  options: QuizOption[]
  correctOptionId: string
  explanation: string
}

export type LessonStatus = 'locked' | 'in-progress' | 'complete'

export type ModuleConfig = {
  id: string
  title: string
  type: ModuleType
  goal: string
  lessonIds: string[]
}

export type LessonConfig = {
  id: string
  moduleId: string
  title: string
  type: LessonType
  /**
   * Pedagogical intent — required for coding lessons, omitted for reading lessons.
   * concept | guided-practice | open-practice | project
   */
  goal?: LessonGoal
  /**
   * Reading lessons: 5–8 cards.
   * Coding lessons: 2–4 cards shown before the editor unlocks.
   */
  content: ContentCard[]
  quiz?: QuizQuestion[]
  // Coding-lesson fields (optional for reading lessons)
  starterCode?: string
  progressiveHints?: string[]
  challenge?: string
}

// ── Legacy lesson type (coding lessons, pre-migration) ────────────────────────

export type Lesson = {
  id: string
  title: string
  concept: string
  starterCode: string
  expectedOutput: string
  hints?: string[]
  progressiveHints?: string[]
  challenge?: string
}

export type SandboxExample = {
  id: string
  title: string
  code: string
}

export type ExecutionResponse = {
  stdout: string
  stderr: string
  error_type: string | null
  timed_out: boolean
  exit_code: number | null
}
