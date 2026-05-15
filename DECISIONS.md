# Design Decisions

A running log of architectural, UX, and product decisions made during development.
Most recent decisions are at the top of each section.

---

## Licensing

### 2026-05-15 — Switched from GNU GPL to MIT
**Decision:** Replace the GNU GPL v3 license with MIT.
**Rationale:** MIT keeps all options open — the project can be open-sourced, commercialized, or both. GPL would have required open-sourcing any distributed version and forced the same on downstream users, which is too restrictive for a project that may go commercial.

---

## Frontend Dependencies

### 2026-05-15 — Added Lucide React for icons
**Decision:** Use `lucide-react` as the project's icon library.
**Rationale:** SVG icons from Lucide scale naturally with font-size, eliminating CSS sizing hacks for icon buttons. MIT licensed. Tree-shaken by Vite, so only imported icons are bundled (~1–2 KB per icon). Chosen over Heroicons and Phosphor for its clean style and React-native API.

---

## UI / UX

### 2026-05-15 — Icon buttons have no border or background
**Decision:** Icon buttons (`icon-btn` class) use a transparent background with no border; hover turns the icon blue.
**Rationale:** Borders on icon buttons looked visually inconsistent with the SVG icon style. Borderless keeps them lightweight and unobtrusive while the hover state preserves affordance.

### 2026-05-15 — Consistent icon button class: `icon-btn`
**Decision:** All icon-only buttons in the app use the `icon-btn` CSS class.
**Rationale:** Enforces visual consistency across the app as more icon buttons are added (e.g. hints, sandbox, toolbar). Decouples icon button styling from text button styling cleanly.

### 2026-05-15 — Welcome modal shows on every page load; reopenable via `?` icon
**Decision:** The welcome/how-to-use modal appears every time the app loads (not just on first visit). A `CircleHelp` icon button in the top nav reopens it at any time.
**Rationale:** The app is for children who may need reminders about how it works. Showing it every time ensures they always have context. The nav icon gives quick access without cluttering the UI.

### 2026-05-15 — Help icon is `CircleHelp` (Lucide), distinct from hint icon (💡)
**Decision:** The app-level help action uses `CircleHelp` from Lucide. Lesson hints use 💡.
**Rationale:** The two concepts are different — app help vs. lesson-level hints. Using distinct icons prevents confusion.

---

## Lesson Design

### 2026-05-15 — Progressive hints: comment outline → steps → full solution
**Decision:** Lessons use a structured 3-step hint system revealed one step at a time on demand, rather than showing hints (or the answer) upfront.
**Rationale:** Showing the answer by default removes the learning challenge. Progressive hints let kids try first, then get scaffolded support only if needed.

### 2026-05-15 — Starter code is blank (single comment prompt)
**Decision:** Lesson editors start with only a comment prompt, not pre-filled answer code.
**Rationale:** Pre-filling the answer teaches nothing. A blank editor with a comment nudge encourages the student to write the code themselves.

### 2026-05-15 — "Dive Deeper" challenge per lesson
**Decision:** Each lesson includes an optional challenge problem shown at the bottom of the lesson panel.
**Rationale:** Faster learners need extension material. The challenge is optional so it doesn't block progression but rewards curiosity.

### 2026-05-15 — Completion is open-ended / self-reported (no auto-checking) for now
**Decision:** Lesson completion is not auto-detected from output matching; students mark lessons complete themselves.
**Rationale:** Many lessons have open-ended goals (e.g. "write a poem"). Auto-checking would require fixed expected outputs, which is too constraining for creative exercises. Revisit when lesson content is more locked down.

### 2026-05-15 — "String" terminology deferred to a Types sub-lesson after Lesson 2
**Decision:** The word "string" is not introduced in Lesson 1. It will be introduced in a dedicated Types sub-lesson following Lesson 2: Variables.
**Rationale:** Introducing too much terminology at once is overwhelming for young learners. Lesson 1 focuses solely on `print()` syntax and behavior.

---

## Content Structure

### 2026-05-15 — Curriculum hierarchy: Course → Module → Lesson → ContentCard + Quiz
**Decision:** Formalize the curriculum as a 4-level hierarchy: Course > Module > Lesson > ContentCard (+ optional Quiz and Practical).
**Rationale:** Keeps the app architecture clean as modules expand. Each level has a clear responsibility. ContentCards are the atomic unit of lesson content — not markdown blobs — giving future flexibility for animations, illustrations, narration, and per-card progress tracking.

### 2026-05-15 — One file per lesson, one index.ts per module
**Decision:** Curriculum content lives in `src/data/curriculum/moduleN/lesson-N.ts` files. Each module has an `index.ts` for metadata. `curriculum.ts` assembles everything in order. The app imports only from `curriculum.ts`.
**Rationale:** Makes individual lessons easy to open, read, tweak, and compare in isolation. Adding a lesson = one new file + one import line. Avoids a single massive `lessons.ts` that becomes hard to navigate as content grows.

### 2026-05-15 — ContentCard rule: no card should take more than ~30 seconds to read
**Decision:** Each ContentCard must be short enough to read in ~30 seconds. One concept per card. Heavy visual spacing.
**Rationale:** Children disengage quickly from dense text. Short cards prevent cognitive overload and make progress feel fast.

### 2026-05-15 — Module 1 expanded to 3 lessons: 0a, 0b, 0c
**Decision:** Module 1 ("What Programming Is") has three lessons:
- 0a: Introduction to Programming
- 0b: How Computers Follow Instructions *(new)*
- 0c: Introduction to Python
**Rationale:** Lesson 0b teaches that computers are literal and that order and precision matter — preventing a large class of beginner confusion before students write a line of code. The correct mental model sequence is: programs exist → computers follow instructions literally → Python is a tool for writing those instructions.

### 2026-05-15 — Teaser code in Lesson 0c must be immediately interpretable
**Decision:** The code preview in Lesson 0c uses only immediately readable snippets (e.g. `print("Welcome to Python!")` or `name = "Alex" / print(name + " found a treasure chest!")`). No abstractions like function definitions.
**Rationale:** Kids tolerate syntax better than abstract explanation. The goal is excitement and recognizability, not instruction.

### 2026-05-15 — Module 1 is read-only with comprehension quizzes (no code editor)
**Decision:** Module 1 uses read-only lesson cards and multiple choice / true-false comprehension quizzes instead of a code editor.
**Rationale:** These lessons are conceptual, not hands-on. Quizzes are 3–5 questions, mix of multiple choice and true/false, no open-ended answers.

### 2026-05-15 — Two module types: `reading` and `coding`
**Decision:** Modules are typed as either `reading` (content + comprehension quiz) or `coding` (editor + hints + challenge + coding practical).
**Rationale:** Separates conceptual intro material from hands-on coding practice cleanly in both the data model and UI.

### 2026-05-15 — Welcome/how-to-use is separate from Module 1 lessons
**Decision:** The "how to use this app" onboarding is a modal, not a lesson. Module 1 lessons are about programming concepts, not app mechanics.
**Rationale:** Conflating app onboarding with curriculum content would be confusing.

### 2026-05-15 — Lesson and module configs are JSON files, not TypeScript
**Decision:** All curriculum content (cards, quiz questions, module metadata) lives in `.json` files under `src/data/curriculum/`. A single `loader.ts` statically imports them and exports fully-typed data. The app imports from `loader.ts` only.
**Rationale:** JSON keeps content clearly separate from code — no TypeScript knowledge needed to edit a lesson. Vite handles static JSON imports natively; `resolveJsonModule: true` added to `tsconfig.app.json`. Statically imported for now (no runtime fetch) — easy to switch to a CMS fetch later without changing the loader's public API.

### 2026-05-15 — Intro lessons (0a, 0b, 0c) are Module 1; coding lessons start at Module 2
**Decision:** Module 1 contains three reading lessons (0a, 0b, 0c). The first coding lesson (`print()`) begins Module 2.
**Rationale:** Gives the curriculum a clear narrative arc: orient → conceptual framing → hands-on coding.

---

## Navigation & Progress

### 2026-05-15 — Module Overview Screen is the home screen
**Decision:** The app's home/default view is a Module Overview Screen (vertical stack of module cards), not a flat lesson list.
**Rationale:** Flat lesson lists don't communicate structure or progress. Module cards give learners a clear sense of where they are and what's ahead.

### 2026-05-15 — Linear unlock: future lessons are locked until previous is complete
**Decision:** A lesson is locked if any lesson before it in the curriculum is incomplete. The practical is locked until all lessons in its module are done. The next module is locked until the practical is done.
**Rationale:** Prevents learners from skipping foundational content. Completed lessons remain fully re-visitable at any time.

### 2026-05-15 — Lesson completion trigger varies by lesson type
**Decision:** Three completion triggers depending on lesson type:
1. Reading lesson *with* quiz → quiz submission auto-completes
2. Reading lesson *without* quiz → "Finish" button on the last content card auto-completes
3. Coding lesson → manual "Mark as complete" button (no auto-check for now)

**Rationale:** Lessons without quizzes should feel conclusive without requiring an extra explicit action — the "Finish" button on the last card is that natural stopping point. Coding lessons can't be auto-checked yet, so manual completion is the fallback.

### 2026-05-15 — Progress saved to localStorage via a `useProgress` hook
**Decision:** All progress state lives in `localStorage` under the key `studious-progress`. A single `useProgress` hook owns all reads and writes. Shape: `{ moduleId: { lessonId: "locked"|"in-progress"|"complete" } }`.
**Rationale:** No backend auth needed for MVP. A dedicated hook keeps progress logic out of components and makes it easy to migrate to a backend later.

### 2026-05-15 — Stable lesson IDs are the canonical progress key
**Decision:** Every lesson has a stable `id` (e.g. `"module1-lesson-0a"`) defined in `curriculum.ts`. Progress keys always match these IDs.
**Rationale:** Changing a lesson title or order must not reset a learner's progress. Decoupling the key from display strings prevents accidental progress loss.
