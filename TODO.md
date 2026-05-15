# TODO

A running list of things to work on for **studious-code-titan**.

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

### Lesson 0a: Introduction to Programming *(new)*
- [ ] Write concept — what is programming, what is a computer program, why it matters; keep it fun and concrete for kids
- [ ] No code editor needed — could be a read-only "story" panel or a simple animated explainer
- [ ] Decide on format: text-only lesson, or include a non-editable code preview as illustration

### Lesson 0b: Introduction to Python *(new)*
- [ ] Write concept — what Python is, why it's a great first language, what kinds of things people build with it
- [ ] Show a tiny teaser snippet (non-editable) to excite the learner before lesson 1
- [ ] Decide on format: text-only or illustrated

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
