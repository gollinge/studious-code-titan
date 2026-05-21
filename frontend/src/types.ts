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
  /** Optional code snippet rendered as a <pre> block after the body text. */
  codeBlock?: string
  /** Optional text rendered below the codeBlock. */
  note?: string
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
 * `starterCode` is only used on `steps[0]` (sets initial editor content)
 * and `bonusSteps[0]` (resets editor to a blank slate when bonus begins).
 * Steps are additive — the editor is never reset between main steps.
 */
export type Step = {
  instruction: string
  /** Initial editor content. Only meaningful on steps[0] and bonusSteps[0]. */
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
  /**
   * Guided steps shown above the editor, one at a time.
   * Each step is revealed after a successful run of the previous one.
   * Steps are additive — the editor is never cleared between main steps.
   * `steps[0].starterCode` sets the initial editor content.
   */
  steps?: Step[]
  /**
   * Optional bonus steps shown after all main steps are done.
   * `bonusSteps[0].starterCode` resets the editor when bonus begins.
   */
  bonusSteps?: Step[]
  /** @deprecated Use `steps` instead */
  editorPrompt?: string
  /** @deprecated Use `steps` instead */
  starterCode?: string
  /** @deprecated Use `steps` instead */
  challenge?: string
  /** @deprecated Use `steps` instead */
  editorInstruction?: string
  /** @deprecated Use `steps` instead */
  editorInstructionStep2?: string
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
