# TODO

## In Progress
<!-- Move items here when actively working on them -->

---

## Backlog

### Navigation & Flow
- [x] **"Next Lesson →" button** — appears in lesson view only after lesson is marked complete; advances to the next lesson in the module
- [x] **Next Lesson phase reset** — fixed: "Next Lesson →" now always starts the next lesson from card 1 (not mid-editor or mid-quiz)
- [ ] **Welcome modal** — shown on first visit only (localStorage flag); explains the editor, hints, Dive Deeper, and Cmd+Enter shortcut; never shown again after dismissal
- [ ] **Phase grouping in Module Overview** — add a `Phase` type above `ModuleConfig`; group module cards under phase headers in the overview screen. Phases:
  | Phase | Modules | Focus |
  |---|---|---|
  | Foundations | 1–5 | Core programming concepts |
  | Consolidation | 6 | First major creative expansion |
  | Expansion | 7–8 | New expressive capabilities |
  | Consolidation | 9 | Larger creative ownership |
  | Advanced Beginner | 10–11 | Dynamic systems and project structure |
  | Independent Creation | 12 | Self-directed building |
  | Optional Exploration | 13–14 | Exposure to broader programming ideas |
  Implementation: `Phase` type in `types.ts`, `phases.ts` data file, phase header rows in `ModuleOverview.tsx`, unbuilt modules show "Coming soon" state.

### Module 4 — Loops *(committed b32310f)*
- [x] **Lesson 3a** — Why Loops Exist (`for`, `range()`, indentation)
- [x] **Lesson 3b** — Counting with range() (start/stop/step, countdown)
- [x] **Lesson 3c** — Building Patterns (string multiplication, open practice)
- [x] **Lesson 3d** — Loops + Decisions (`if` inside loops, `%` operator)
- [x] **Final Project** — Loop-Powered Mini Game (dungeon run; all concepts combined)

### Module 1 Practical
- [ ] **Combined comprehension quiz** — covers lessons 0a, 0b, 0c; unlocks after all three are complete

### Module 3 Review
- [ ] **Play through all 5 Module 3 lessons** and fix any content issues (input form, code formatting, story quality)

### Sandbox
- [ ] **Reference sheet popup** — toggleable floating panel with a Python syntax cheat sheet covering what's been taught
- [ ] **Sandbox starter ideas** — revisit the current static example list; add curated starter programs, themed prompts, or remix-able project shells that invite open-ended creation (see VISION.md — The Sandbox)

### VISION.md — Open Items
- [ ] **Audience section** — fill in primary learner age range, context (home/school/self-directed), and assumed prior experience
- [ ] **Scope ceiling** — confirm which module is the curriculum endpoint and which concepts are firmly out of scope for structured lessons
- [ ] **Success criteria** — fill in the three "succeeding when" bullet points with concrete, observable signals
- [ ] **Accounts decision** — confirm whether local-only / no accounts is intentional long-term; note cross-device progress implications
- [ ] **What This Is Not** — add any other deliberately excluded features or approaches

### Polish
- [ ] **Output validation against step instructions** — each `steps[]` and `bonusSteps[]` entry can optionally specify a `validate` rule (e.g. expected output contains a string, output has N lines, no error) so the lesson can give targeted feedback instead of accepting any successful run as step completion. Backend could return structured output; frontend checks it before advancing the step counter.
- [ ] **Remove legacy top-level `editorPrompt`, `starterCode`, `editorInstruction`, `editorInstructionStep2`, `challenge` fields** — once all lessons have been migrated to use `steps[]` and `bonusSteps[]`, strip these deprecated fields from all lesson JSON files and remove the fallback logic in `CodingLesson.tsx`. Also remove the `@deprecated` fields from `LessonConfig` in `types.ts`.
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
