# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A local-only Python learning web app for children. The frontend (React + Vite + CodeMirror) presents lessons and an editor; the backend (FastAPI) executes the student's Python in a sandboxed subprocess. There is no auth and no remote database — progress lives in `localStorage`.

## Commands

Backend (from `backend/`):
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
pytest                          # full suite
pytest tests/test_executor.py::test_name   # single test
```

Frontend (from `frontend/`):
```bash
npm install
npm run dev          # Vite dev server, port 5173 (strictPort: true)
npm run build        # tsc -b + vite build
npm run lint         # eslint
```

Open the app at <http://127.0.0.1:5173>. The frontend talks to the backend at `127.0.0.1:8000`; both must be running.

## Architecture

### Sandboxed Python executor (`backend/app/executor.py`)
The single non-trivial piece of backend code. Every `POST /api/execute` call:
1. Writes the student's code + a `RUNNER_SCRIPT` to a fresh `tempfile.TemporaryDirectory`.
2. Runs `python -I -S runner.py main.py` as a subprocess with a 2-second timeout and `stdin` piped in.
3. The runner monkey-patches `builtins.__import__`, `builtins.open`, and `socket.*` to block a hardcoded set of imports (`os`, `subprocess`, `socket`, `urllib`, `pathlib`, …), restrict file access to the temp workspace + stdlib, and disable network I/O. It then `exec`s the student code with redirected stdout/stderr.
4. Returns `{stdout, stderr, error_type, timed_out, exit_code}`. `error_type` is extracted from the stderr traceback via regex.

This sandbox is defense-in-depth for local dev, not a hostile-input sandbox. Don't rely on it to contain a determined attacker.

### Curriculum data model (`frontend/src/data/curriculum/`)
Lesson content is **JSON, not TypeScript**. Each module lives in its own folder (`module1/`, `module2/`, …, `module-creative-1/`) containing one `module.json` plus one `lesson-*.json` per lesson. `loader.ts` statically imports every JSON file and exports `modules`, `allLessonConfigs`, and lookup helpers — **the app must import from `loader.ts` only**, never from individual JSON files. Adding a lesson = create the JSON file + add one import line to `loader.ts` + add its ID to the module's `lessonIds`.

Lesson shape (`frontend/src/types.ts`):
- `type: 'reading' | 'coding'` — reading lessons end in a quiz; coding lessons open the editor after a few intro cards.
- `goal: 'concept' | 'guided-practice' | 'open-practice' | 'project'` — required for coding lessons. `project` lessons render via `ProjectStudio` with `milestones[]` (substring checks against student code) and `remixIdeas[]`. The other three goals render via `CodingLesson`.
- `content: ContentCard[]` — atomic units of lesson text. Card `type` can be `text`, `callout`, `code`, `puzzle` (inline multiple-choice), or `runner` (inline runnable Python). One concept per card.
- `steps: Step[]` and optional `bonusSteps: Step[]` — the guided coding flow. **Steps are additive**: the editor is never cleared between main steps. Only `steps[0].starterCode` and `bonusSteps[0].starterCode` set editor content; subsequent steps just update the instruction banner.

### Routing and progress
`App.tsx` defines four routes: `/`, `/modules/:moduleId`, `/modules/:moduleId/lessons/:lessonId`, `/sandbox`. Progress lives in `localStorage` under `studious-progress-v2` and is owned exclusively by `useProgress` (`frontend/src/hooks/useProgress.ts`). Shape: `{ [moduleId]: { [lessonId]: 'locked' | 'in-progress' | 'complete' } }`.

Unlock rules (enforced in `useProgress.markComplete`):
- Completing a lesson unlocks the next lesson **within the same module**.
- When every lesson in a module is complete, the first lesson of the **next module** unlocks.
- `LessonRoute` redirects `locked` lessons back to module detail — direct URL navigation cannot skip ahead.

Stable lesson IDs (e.g. `module1-lesson-1a`) are the canonical progress key — never tied to title or position. Renaming or reordering a lesson must preserve its ID or learners lose progress.

### Frontend–backend coupling
CORS allowlist in `backend/app/main.py` includes Vite ports 5173–5176. Vite is locked to 5173 via `strictPort: true` so it fails loudly rather than drifting to an un-whitelisted port. If you add a new dev port, update both sides.

## Conventions worth knowing

- **No backwards-compat shims.** When migrating data shapes, update the JSON and types together; `loader.ts` has a few `@deprecated` aliases marked for transition only.
- **Completion is self-reported for coding lessons.** Reading lessons auto-complete on quiz submit or last-card "Finish"; coding lessons require an explicit "Mark complete" tap. There is no expected-output matching.
- **Hints are progressive** (comment outline → steps → full solution), revealed one at a time on demand. Starter code is exposed as hint 0, not pre-filled in the editor.
- **Card budgets:** reading lessons 5–8 cards + 5-question quiz; coding lessons 2–4 cards + challenge + 0–3 mini-quiz questions. Each card must read in ~30 seconds.

See `DECISIONS.md` for the full design-decision log and `product/VISION.md` for product framing. `TODO.md` tracks in-flight work.
