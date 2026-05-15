export type AppMode = 'lessons' | 'sandbox'

// ── Curriculum types ──────────────────────────────────────────────────────────

export type LessonType = 'reading' | 'coding' | 'quiz' | 'hybrid'

export type ModuleType = 'reading' | 'coding'

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
