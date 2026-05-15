# TODO

## In Progress
<!-- Move items here when actively working on them -->

---

## Backlog

### Navigation & Flow
- [ ] **"Next Lesson →" button** — appears in lesson view only after lesson is marked complete; advances to the next lesson in the module
- [ ] **Welcome modal** — shown on first visit only (localStorage flag); explains the editor, hints, Dive Deeper, and Cmd+Enter shortcut; never shown again after dismissal

### Module 1 Practical
- [ ] **Combined comprehension quiz** — covers lessons 0a, 0b, 0c; unlocks after all three are complete

### Module 3 Review
- [ ] **Play through all 5 Module 3 lessons** and fix any content issues (input form, code formatting, story quality)

### Sandbox
- [ ] **Reference sheet popup** — toggleable floating panel with a Python syntax cheat sheet covering what's been taught

### Polish
- [ ] **Mobile layout** — test and fix layout on small screens
- [ ] **Delete `lessons.ts`** — legacy file, no longer imported anywhere

### Infra
- [ ] **Docker Compose** — single command to start frontend + backend
- [ ] **Backend test coverage** — expand `backend/tests/test_executor.py` (stdin, timeout, blocked imports)
- [ ] **Document env vars** — `VITE_API_URL` and others in README

### Localization *(deferred)*
- [ ] Choose i18n library (`react-i18next` or `FormatJS`)
- [ ] Extract all user-facing strings into locale files
- [ ] Locale switcher in TopNav
- [ ] Translate Module 1 content as pilot
- [ ] Note RTL requirements for Arabic/Hebrew (defer implementation)

---

## Done

### Modules & Structure
- [x] Group lessons into modules (Module 1: reading, Module 2+: coding)
- [x] Module overview screen (home)
- [x] Module detail screen (lesson list with lock/unlock)
- [x] Two module types: `reading` (cards + quiz) and `coding` (cards + editor)
- [x] Curriculum file structure — JSON per lesson + module, assembled by `loader.ts`
- [x] `ModuleConfig`, `LessonConfig`, `ContentCard`, `LessonType`, `LessonGoal` types in `types.ts`
- [x] Stable lesson IDs (e.g. `module2-1a`) matched to progress keys

### Navigation & Progress
- [x] Breadcrumb (`Module N › Lesson N`) in lesson view
- [x] Back arrow returns to Module Detail Screen
- [x] Lock/unlock rules (completed → revisitable, current → unlocked, future → locked)
- [x] Lesson completion triggers (quiz submission, Finish button, Mark Complete)
- [x] `useProgress` hook — single source of truth for progress
- [x] Progress saved to `localStorage`

### Module 1 — What Programming Is *(reading)*
- [x] Lesson 0a — Introduction to Programming (cards + 4-question quiz)
- [x] Lesson 0b — How Computers Follow Instructions (cards + 4-question quiz)
- [x] Lesson 0c — Introduction to Python (cards, no quiz → Finish button)

### Module 2 — Your First Python Programs *(coding)*
- [x] Lesson 1a — Running Your First Program (`print()`, concept)
- [x] Lesson 1b — Telling Stories with Python (multiple `print()` lines)
- [x] Lesson 1c — Variables (store and print a variable)
- [x] Lesson 1d — Making Programs Dynamic (string concatenation)
- [x] Final Project — Mini Adventure Intro (variables + print story)

### Module 3 — Making Programs Interactive *(coding)*
- [x] Lesson 2a — Talking to the Player (`input()`, string concat)
- [x] Lesson 2b — Programs That Make Choices (`if`, `==`, indentation)
- [x] Lesson 2c — More Than One Choice (`else`, two-path branching)
- [x] Lesson 2d — Building a Tiny Game (all skills combined)
- [x] Final Project — Choose Your Own Adventure (3+ choices, multiple endings)

### Editor & Coding Lesson UX
- [x] Editor starts blank with `# editorPrompt` comment; starter code is hint 0
- [x] Progressive hints UI — "Show Hint" reveals one hint at a time
- [x] Dive Deeper mode — amber UI, code preserved when switching to challenge
- [x] Card summaries shown as sidebar TLDR during editor phase
- [x] Friendly error display — real error + `? Help` toggle with child-readable explanation
- [x] Keyboard shortcut (Cmd/Ctrl+Enter) visible in toolbar
- [x] Reset button restores blank editor
- [x] Line wrapping in editor
- [x] `input()` detection — shows labeled input form before running; stdin piped to backend
- [x] Card code formatting — prose and code paragraphs auto-detected and styled

### Backend
- [x] FastAPI executor — sandboxed Python runner (blocked imports, no network, no file escape)
- [x] CORS configured for Vite ports 5173–5176
- [x] `stdin` support — `ExecuteRequest.stdin` piped to subprocess
- [x] Friendly timeout (2s) with `TimeoutError` response
