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
  /** One-sentence TLDR shown in the coding lesson sidebar as a quick reference. */
  summary?: string
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

/**
 * A single guided step in the coding lesson flow.
 * `instruction` is shown in the banner above the editor.
 * If `editorPrompt` or `starterCode` are provided, the editor resets
 * to that content when the step begins.
 */
export type Step = {
  instruction: string
  editorPrompt?: string
  starterCode?: string
}

export type ModuleConfig = {
  id: string
  title: string
  type: ModuleType
  goal: string
  lessonIds: string[]
}

/**
 * A milestone is a detectable achievement in a ProjectStudio lesson.
 * `check` is tested as a substring of the student's code on each Run.
 */
export type Milestone = {
  id: string
  label: string
  /** Substring tested against the student's code string on each Run. */
  check: string
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
  /** Short prompt shown as a comment at the top of the editor */
  editorPrompt?: string
  /**
   * Guided steps shown above the editor, one at a time.
   * Each step is revealed after a successful run of the previous one.
   * `editorPrompt` and `starterCode` on a step reset the editor when that step begins.
   */
  steps?: Step[]
  /**
   * Optional bonus steps shown after all main steps are done.
   * Same structure as `steps`.
   */
  bonusSteps?: Step[]
  /** Legacy single-step bonus prompt — used by lessons without bonusSteps */
  challenge?: string
  /** @deprecated Use `steps` instead */
  editorInstruction?: string
  /** @deprecated Use `steps` instead */
  editorInstructionStep2?: string
  starterCode?: string
  progressiveHints?: string[]
  // ProjectStudio fields
  milestones?: Milestone[]
  remixIdeas?: string[]
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
