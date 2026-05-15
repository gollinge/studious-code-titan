# TODO

A r### Modules & Comprehension Practicals *(new)*
- [ ] **Group lessons into modules** — organize lessons into themed modules:
  - Module 1: Introduction *(reading only, no code editor, comprehension quiz per lesson + combined practical quiz)*
  - Module 2+: Coding modules *(have editor, progressive hints, Dive Deeper challenge, and a coding practical at the end)*
- [ ] **Module overview screen** — a UI view that shows the modules, which lessons are inside each, and progress through them
- [ ] **Two module types:**
  - `reading` — lessons are content cards with a comprehension quiz; practical is a combined quiz
  - `coding` — lessons have an editor + hints + challenge; practical is an open-ended coding project
- [ ] **Decide on module groupings** — sketch out which existing (and planned) lessons belong in each coding module and what each practical will belist of things to work on for **studious-code-titan**.

---

## In Progress
<!-- Move items here when actively working on them -->

## Backlog

### Modules & Comprehension Practicals *(new)*
- [ ] **Group lessons into modules** — organize lessons into themed modules (e.g. Module 1: Getting Started, Module 2: Working with Data, etc.)
- [ ] **Module overview screen** — a UI view that shows the modules, which lessons are inside each, and progress through them
- [ ] **Comprehension practical per module** — a mini open-ended coding project at the end of each module that combines the skills from its lessons
  - Practical should have a brief spec/prompt but no hints — the student applies what they learned
  - Marked complete when the student decides they are done (no auto-checking for now)
- [ ] **Decide on module groupings** — sketch out which existing (and planned) lessons belong in each module and what each practical challenge will be

### Navigation & Progress
- [x] **Home screen (Module Overview)** — replaces current lesson list; vertical stack of module cards showing title, type badge (`Reading` / `Coding`), progress bar (e.g. "2 / 4 lessons"), and status (`Not started` / `In progress` / `Complete`)
- [x] **Module Detail Screen** — shows ordered lesson rows with status icons (✅ complete · 🔵 current · 🔒 locked); "Continue" button jumps to current lesson; practical row locked until all lessons complete
- [x] **Breadcrumb** — `Module N › Lesson N` breadcrumb in lesson view; back arrow returns to Module Detail Screen
- [ ] **"Next Lesson →" button** — appears in lesson view only after lesson is marked complete
- [x] **Lock / unlock rules:**
  - Completed lessons: always re-visitable
  - Current lesson (first incomplete): unlocked
  - Any future lesson: locked
  - Module practical: locked until all lessons in module complete
  - Next module: locked until practical complete
- [x] **Lesson completion triggers:**
  - Reading lesson *with* quiz: quiz submission auto-completes the lesson
  - Reading lesson *without* quiz: a **"Finish"** button on the last content card auto-completes the lesson (no separate "mark complete" step)
  - Coding lesson: a **"Mark as complete"** button, always visible once the lesson is open (manual, no auto-check for now)
  - Quiz/practical: submitting all answers auto-completes
- [x] **`useProgress` hook** — owns all progress reads/writes; single source of truth
- [x] **Progress persistence** — save to `localStorage` under key `studious-progress`; shape:
  ```json
  {
    "module1": { "lesson-0a": "complete", "lesson-0b": "in-progress", "practical": "locked" },
    "module2": { "lesson-1": "locked" }
  }
  ```
- [x] **Stable lesson IDs** — each lesson must have an `id` (e.g. `"module1-lesson-0a"`) that matches the progress key; defined in curriculum data, never changes

---

### Landing Page / Onboarding
- [ ] **"How to use this app" welcome modal** — shown on first visit only (localStorage flag), dismissable; should explain:
  - What the app is and who it's for
  - How the lesson panel, code editor, and output panel work together
  - How hints work (click to reveal one at a time)
  - The Dive Deeper challenge concept
  - The Cmd/Ctrl+Enter shortcut to run code
- [ ] Modal should not appear again after first dismissal (set a `hasSeenWelcome` flag in localStorage)

### Module 1: What Programming Is *(read-only + comprehension)*
**Goal:** Build mental models before any coding begins.

#### Lesson 0a — Introduction to Programming *(type: reading)*
- [x] Write content as short ContentCards (~30s read each), one concept per card
- [x] Write 4 quiz questions (multiple choice + true/false)

#### Lesson 0b — How Computers Follow Instructions *(type: reading)*
- [x] Write content as short ContentCards
- [x] Write 4 quiz questions (multiple choice + true/false)

#### Lesson 0c — Introduction to Python *(type: reading)*
- [x] Write content as short ContentCards (no quiz → Finish button on last card)

#### Module 1 Practical
- [ ] Combined comprehension quiz covering all three lessons

### Cross-cutting Lesson Work
- [x] **Curriculum file structure** — JSON files per lesson + module, assembled by `loader.ts`
- [x] **Curriculum hierarchy** — `Course → Module → Lesson → ContentCard + Quiz` in data model
- [x] **`LessonType`**, **`ContentCard`**, **`QuizQuestion`**, **`ModuleConfig`**, **`LessonConfig`** — all defined in `types.ts`
- [x] **`LessonType` simplified** — `"reading" | "coding"` only; no `hybrid` (coding lessons always embed 2–4 instruction cards before the editor)
- [x] **`LessonGoal`** — type defined (`"concept" | "guided-practice" | "open-practice" | "project"`); added as optional field on `LessonConfig`; to be set when coding lessons migrate to JSON
- [x] **`Lesson` schema migration** — add `moduleId`, `type`, `goal`, `content: ContentCard[]`, `quiz?`; make `starterCode` optional; migrate module 2 lessons to JSON
- [x] **Migrate existing `lessons.ts`** — module 2 rebuilt from scratch as JSON; `lessons.ts` fully removed from App.tsx (archived, not deleted yet)
- [x] **Read-only lesson UI mode** — content card reader with Finish/Next buttons; no editor
- [x] **Reading comprehension quiz UI** — multiple choice and true/false; shows explanation after each answer
- [x] **Module type field** — `reading` vs `coding` modules distinguished in data and UI
- [x] **Coding lesson card flow** — 2–4 instruction cards shown before editor unlocks; "Open Editor →" on last card; "← Review Cards" in editor phase
- [x] **Quiz budget** — reading lessons: 5-question quiz; coding lessons: 0–3 question optional mini-quiz only
- [x] **Editor starts blank with objective comment** — `editorPrompt` field on each lesson JSON becomes `# comment` in editor; starter code is hint 0
- [x] **Card summaries in editor sidebar** — `summary` field on `ContentCard`; shown as TLDR under each card title in the left tray during editor phase
- [x] **Friendly error display in output console** — real error shown + `? Help` toggle reveals child-readable explanation; error type mapped to message

### Lesson 1: print()
- [x] Expand concept — "print() is a command that makes Python display a message on the screen. The parentheses () mean 'do this action now.' Anything inside quotes \" \" is text and Python will show it exactly as typed."
- [x] Starter code: blank with a single comment prompt — `# Write your first line of Python here`
- [x] Completion: open-ended / explore freely for now (no auto-checking)
- [x] Add progressive hints:
  1. Comment outline (e.g. `# use print() with a message inside quotes`)
  2. Syntax with placeholder (`print("your message here")`)
  3. Full working example as final hint
- [x] Add "Dive Deeper" challenge — print a short poem using at least 4 `print()` lines (each line of the poem is one `print()` call)

### Lesson 2: Variables
- [ ] Expand concept — explain what a variable name is, how assignment works (`=`), and the difference between text and number values; do NOT introduce "string" yet
- [ ] Add sub-lesson 2b: **Types** — introduce strings, integers, and floats after variables; save `str` / `int` / `float` terminology for here
- [ ] Replace pre-filled answer as starter code with a blank editor
- [ ] Add progressive hints:
  1. Comment outline (e.g. `# create a variable and print it`)
  2. Show variable assignment syntax with placeholder
  3. Full working example as final hint
- [ ] Add "Dive Deeper" challenge — e.g. create 3 variables about yourself (name, age, favorite color) and print a sentence combining them

### Lesson 3: Numbers and Math
- [ ] Expand concept — cover `+`, `-`, `*`, `/`, and `//` with plain-language descriptions; mention that numbers don't need quotes
- [ ] Replace pre-filled answer as starter code with a blank editor
- [ ] Add progressive hints:
  1. Comment outline (e.g. `# store two numbers and print their sum`)
  2. Show one operator example
  3. Full working example as final hint
- [ ] Add "Dive Deeper" challenge — e.g. calculate how many seconds are in a day, or figure out how many pizza slices each person gets

### Lesson 4: if Statements
- [ ] Expand concept — explain conditions, `==`, `True`/`False`, indentation, and the `else` block
- [ ] Replace pre-filled answer as starter code with a blank editor
- [ ] Add progressive hints:
  1. Comment outline (e.g. `# check a condition and print different messages`)
  2. Show `if` structure with placeholders
  3. Full working example as final hint
- [ ] Add "Dive Deeper" challenge — e.g. check a score variable and print "Amazing!", "Good job!", or "Keep practicing!" depending on the range

### Lesson 5: Loops
- [ ] Expand concept — explain what `range()` does, how the loop variable works, and what "iterating" means in kid-friendly terms
- [ ] Replace pre-filled answer as starter code with a blank editor
- [ ] Add progressive hints:
  1. Comment outline (e.g. `# repeat something 5 times using a loop`)
  2. Show `for` structure with placeholders
  3. Full working example as final hint
- [ ] Add "Dive Deeper" challenge — e.g. print a countdown from 10 to 1 and then print "Blast off!"

### Lesson 6: Functions
- [ ] Expand concept — explain `def`, parameters, calling a function, and why reusability matters
- [ ] Replace pre-filled answer as starter code with a blank editor
- [ ] Add progressive hints:
  1. Comment outline (e.g. `# define a function that prints a greeting`)
  2. Show `def` structure with placeholders
  3. Full working example as final hint
- [ ] Add "Dive Deeper" challenge — e.g. write a function that takes a name and a number and prints a personalized cheer that many times

### Lesson 7: Lists
- [ ] Expand concept — explain index (0-based), how to add/access items, and how loops pair with lists
- [ ] Replace pre-filled answer as starter code with a blank editor
- [ ] Add progressive hints
- [ ] Add "Dive Deeper" challenge — e.g. make a list of 5 favorite foods and print only the first and last one

### Lesson 8: Turtle-style Drawing Ideas
- [ ] Evaluate whether this lesson fits — consider replacing or reframing it since real turtle graphics aren't available in the sandbox
- [ ] If kept: expand concept and add progressive hints
- [ ] Add "Dive Deeper" challenge — e.g. design commands for a more complex shape or a simple house outline

---

### Cross-cutting Lesson Work
- [ ] **Progressive hints UI** — build the "Show Hint" button with step-by-step reveal logic in the frontend (needed before per-lesson hint content can be used)
- [ ] **Dive Deeper UI** — make the challenge problem feel distinct and opt-in, not just a paragraph in the sidebar:
  - Render as a dedicated "🚀 Dive Deeper" button at the bottom of the sidebar
  - Pressing it opens a **challenge mode**: swaps the editor prompt comment to the challenge objective, but preserves the current code in a separate slot so it isn't lost
  - A "← Back to lesson" button restores the original prompt and code
  - Challenge mode could have a distinct visual indicator (e.g. different header colour or badge) so the child knows they're in bonus territory
  - Do **not** auto-mark the lesson complete when challenge mode is entered — it's optional
- [ ] **Data model update** — extend the `Lesson` type in `types.ts` to support structured progressive hints (outline → steps → solution) and a `challenge` field for the Dive Deeper problem
- [ ] **Blank starter code** — strip pre-filled answers from `starterCode`; keep full solution only as the final hint

---

### Sandbox
- [ ] **Reference sheet popup** — a toggleable floating panel with a quick-reference cheat sheet of Python syntax covered in the lessons

### Other Features
- [ ] **Lesson completion check** — automatically detect correct output and mark lesson as done
- [ ] **Reset lesson button** — allow users to reset a lesson back to its blank starter state
- [ ] **Sandbox example picker** — dropdown to switch between sandbox examples

### Bugs / Polish
- [ ] **Mobile layout** — test and fix layout on small screens
- [ ] **Friendly error display in output console** — when Python returns an error, show the real error text *and* an inline help message beneath it (triggered by a help icon `?` next to the error). Map common errors to child-readable explanations:
  - `SyntaxError` → "Python couldn't understand this line. Check your quotes, parentheses, or spelling."
  - `NameError` → "Python doesn't recognise that name. Did you create the variable first?"
  - `IndentationError` → "The spacing on this line looks off. Try using the Tab key to indent."
  - `TypeError` → "Two things are being mixed up that don't go together — like a number and a word."
  - Timeout → "Your program ran for too long. Does it have a loop that never stops?"
  - Design: real traceback shown first (collapsible or smaller), help text shown below or toggled by `?` icon
- [ ] **Keyboard shortcut hints** — surface the Cmd/Ctrl+Enter shortcut visibly in the UI

### Localization *(i18n)*
- [ ] **Choose i18n library** — evaluate `react-i18next` or `FormatJS (react-intl)` for the frontend
- [ ] **Extract all user-facing strings** — lesson content, UI labels, modal copy, error messages, hints, quiz questions
- [ ] **Define locale file structure** — e.g. `src/locales/en.json`, `es.json`, etc.; one key namespace per feature area
- [ ] **Locale switcher UI** — language selector in `TopNav` (flag or language name dropdown)
- [ ] **Translate Module 1 content first** — use reading lessons as the pilot since they are the most text-heavy
- [ ] **RTL support consideration** — note which languages (Arabic, Hebrew) would require layout mirroring; defer implementation but don't block it architecturally

### Infra / Dev
- [ ] **Docker Compose setup** — single command to start both frontend and backend
- [ ] **Backend tests** — expand test coverage in `backend/tests/test_executor.py`
- [ ] **Environment variable docs** — document `VITE_API_URL` and any other env vars in README

---

## Done
<!-- Move completed items here -->
