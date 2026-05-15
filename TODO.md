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

---

### Landing Page / Onboarding
- [ ] **"How to use this app" welcome modal** — shown on first visit only (localStorage flag), dismissable; should explain:
  - What the app is and who it's for
  - How the lesson panel, code editor, and output panel work together
  - How hints work (click to reveal one at a time)
  - The Dive Deeper challenge concept
  - The Cmd/Ctrl+Enter shortcut to run code
- [ ] Modal should not appear again after first dismissal (set a `hasSeenWelcome` flag in localStorage)

### Module 1: Introduction *(new, read-only with comprehension quiz)*
- [ ] **No code editor** for this module — lessons are reading cards only
- [ ] **Reading comprehension quiz** at the end of each lesson (multiple choice or short answer) instead of a coding practical
- [ ] Module 1 practical = a comprehension quiz that covers both intro lessons combined
- [ ] Write Lesson 0a content — Introduction to Programming:
  - What is programming? What is a computer program?
  - Real-world examples kids relate to (games, apps, robots)
  - Keep it fun, concrete, no jargon
- [ ] Write Lesson 0b content — Introduction to Python:
  - What Python is and why it's a great first language
  - Famous things built with Python (YouTube, games, NASA scripts etc.)
  - A non-editable teaser code snippet to excite the learner

### Cross-cutting Lesson Work
- [ ] **Read-only lesson UI mode** — support lessons that have no editor (just a content card with a "Continue" button)
- [ ] **Reading comprehension quiz UI** — mix of multiple choice and true/false questions; 3–5 questions per lesson; no open-ended; shows explanation after each answer
- [ ] **Module type field** — distinguish between `coding` modules (have editor + practical) and `reading` modules (have quiz instead)

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
- [ ] **Dive Deeper UI** — add a "Dive Deeper" section per lesson that reveals a challenge problem once the main lesson is completed
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
- [ ] **Error messages** — friendlier, child-readable error messages instead of raw Python tracebacks
- [ ] **Keyboard shortcut hints** — surface the Cmd/Ctrl+Enter shortcut visibly in the UI

### Infra / Dev
- [ ] **Docker Compose setup** — single command to start both frontend and backend
- [ ] **Backend tests** — expand test coverage in `backend/tests/test_executor.py`
- [ ] **Environment variable docs** — document `VITE_API_URL` and any other env vars in README

---

## Done
<!-- Move completed items here -->
