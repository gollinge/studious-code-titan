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

### 2026-05-15 — Module 1 is read-only with comprehension quizzes (no code editor)
**Decision:** Module 1 (Introduction to Programming + Introduction to Python) uses read-only lesson cards and multiple choice / true-false comprehension quizzes instead of a code editor.
**Rationale:** These lessons are conceptual, not hands-on. A quiz reinforces reading comprehension without needing code execution. Quizzes are 3–5 questions, mix of multiple choice and true/false, no open-ended answers.

### 2026-05-15 — Two module types: `reading` and `coding`
**Decision:** Modules are typed as either `reading` (content + comprehension quiz) or `coding` (editor + hints + challenge + coding practical).
**Rationale:** Separates conceptual intro material from hands-on coding practice cleanly in both the data model and UI.

### 2026-05-15 — Welcome/how-to-use is separate from Module 1 lessons
**Decision:** The "how to use this app" onboarding is a modal, not a lesson. Module 1 lessons are about programming concepts, not app mechanics.
**Rationale:** Conflating app onboarding with curriculum content would be confusing. The modal handles app orientation; Module 1 handles conceptual framing.

### 2026-05-15 — Intro lessons (0a, 0b) are Module 1; numbered coding lessons start at Module 2
**Decision:** Lessons "Introduction to Programming" and "Introduction to Python" form Module 1. The first coding lesson (`print()`) begins Module 2.
**Rationale:** Gives the curriculum a clear narrative arc: orient → conceptual framing → hands-on coding.
