
# Audience

<!-- TODO: Fill in -->

**Primary learner:** <!-- e.g. "Children aged 8–13, no prior programming experience" -->

**Context:** <!-- e.g. home, after-school, classroom, self-directed -->

**Secondary audience:** <!-- parents, teachers? What role do they play? -->

**Assumed prior experience:** <!-- can they read? type comfortably? use a mouse? -->

---

# What This Is Not

- **Not a school grading system** — no scores, pass/fail states, or timed tests
- **Not competitive** — no leaderboards, no comparison between learners
- **Not account-based** <!-- TODO: confirm — is local-only intentional long-term? -->
- **Not a reference manual** — syntax is introduced gradually through doing, not catalogued
- **Not a replacement for a human teacher** — it scaffolds; it does not evaluate

<!-- TODO: Add anything else deliberately excluded -->

---

# Scope Ceiling

**Curriculum ends at:** <!-- TODO: e.g. "Module 5 — Functions" -->

**What comes after the ceiling:** The Sandbox. Learners who complete the structured modules
should feel equipped to use it for self-directed creation without needing more lessons.

**Explicitly out of scope for structured lessons:**
<!-- TODO: confirm which are firm -->
TBD

---

# The Sandbox

The Sandbox is a core part of the product, not a secondary feature.

**Role:** After completing the curriculum (or progressing far enough), the Sandbox is where
guided learning gives way to independent creation. No instructions. No right answer. No completion state.

**Design intent:**
- Seeded with starter ideas to reduce blank-page paralysis
- The learner should feel: *"This is my space. I can build anything."*

**The transition the Sandbox enables:**
guided lessons → guided experimentation → **independent creation**

<!-- TODO: Define what "seeded with ideas" looks like in practice.
     Options: curated starter programs, themed prompts, remix-able project shells.
     The current Sandbox has a small set of static examples — this needs revisiting. -->

---

# Success Criteria

The product is **succeeding** when:
- <!-- TODO: e.g. "A 10-year-old completes lesson 3a without adult help" -->
- <!-- TODO: e.g. "After Module 3, the learner modifies the example code unprompted" -->
- <!-- TODO: e.g. "The learner opens Sandbox Mode voluntarily" -->
- The learner asks "what happens if I change this?"

The product is **failing** when:
- The learner needs an adult to explain what a lesson is asking
- The learner stops experimenting after completing the required task
- Errors feel discouraging rather than informative
- Lessons feel like school worksheets

---

# Technical Constraints

<!-- Non-negotiable architectural decisions and the reason behind each. -->

- **Local-first execution** — Python runs on the user's machine via a local FastAPI backend; no cloud sandboxing
- **No user accounts** <!-- TODO: confirm — is this intentional long-term? Implications: no cross-device progress -->
- **Stack:** React + TypeScript + Vite (frontend), FastAPI + Python (backend)
- **Sandboxed subprocess execution** — learner code runs in a subprocess with a timeout; dangerous imports are blocked
- **Static curriculum** — lessons are JSON files loaded at build time; no CMS, no database

<!-- TODO: Document VITE_API_URL and other env vars in README -->

---

# Project Philosophy

This project is not intended to teach programming as an academic subject first.

Its primary goal is to spark curiosity, creativity, experimentation, and confidence through programming.

The learner should feel:
- “I can make things.”
- “I can experiment.”
- “I can solve problems.”
- “Coding is creative.”
- “Mistakes are part of learning.”

The app should avoid feeling like a traditional school worksheet system. Lessons should be short, interactive, concrete, and rewarding. Reading should support action, not replace it.

The curriculum is intentionally structured to:
1. Build mental models first
2. Introduce code gradually
3. Create quick feedback loops
4. Reward experimentation
5. Encourage creativity and remixing
6. Normalize debugging and mistakes
7. Transition from guided learning toward independent creation

The long-term goal is not memorization of syntax.

The long-term goal is for the learner to independently think:
“I have an idea. I want to build it.”


# Curriculum Structure

## Module 1 — What Programming Is

Goal:
Introduce programming conceptually before requiring code writing.

Focus:
- What programming is
- What computer programs do
- Real-world examples
- How computers follow instructions
- What Python is

Lesson Style:
- Reading cards only
- No editable code
- Comprehension quizzes

Educational Purpose:
This module builds confidence and mental models before introducing syntax. The learner should understand that programming is about giving instructions and creating behaviors, not memorizing difficult commands.

Key Outcome:
The learner should finish Module 1 thinking:
“Programming seems interesting and understandable.”

---

## Module 2 — Your First Python Programs

Goal:
Teach the learner that they can directly control program behavior.

Focus:
- print()
- strings
- variables
- changing values
- reading output

Lesson Style:
- Small guided coding exercises
- Immediate visible output
- Minimal theory

Educational Purpose:
This module establishes the first “cause and effect” programming loop:
change code → run program → see result.

The learner should feel successful quickly and frequently.

Key Outcome:
The learner should finish Module 2 thinking:
“I can make the computer do things.”

---

## Module 3 — Making Programs Interactive

Goal:
Teach the learner that programs can react to input and make decisions.

Focus:
- input()
- if
- else
- comparisons
- branching behavior

Lesson Style:
- Interactive coding challenges
- Simple decision-based projects
- Small text adventures and games

Educational Purpose:
This module transforms programs from static scripts into interactive experiences. The learner begins creating programs that respond differently based on user choices.

Key Outcome:
The learner should finish Module 3 thinking:
“I can make games and interactive experiences.”

---

## Module 4 — Repeating Actions with Loops

Goal:
Teach repetition, automation, and pattern creation.

Focus:
- for loops
- range()
- repeated actions
- loop counters
- loops + conditionals

Lesson Style:
- Visual repetition
- Pattern generation
- Small simulations and animations

Educational Purpose:
This module introduces the idea that programs can automate repeated behavior. It also strengthens problem decomposition and pattern recognition.

Loops should feel powerful, not mathematical.

Key Outcome:
The learner should finish Module 4 thinking:
“I can automate things and build more complex behaviors.”

---

## Module 5 — Creating Your Own Commands

Goal:
Teach abstraction and reusable logic through functions.

Focus:
- defining functions
- calling functions
- parameters
- organizing larger programs

Lesson Style:
- Reusable game actions
- Multi-part projects
- Larger structured programs

Educational Purpose:
This module helps the learner move from writing isolated code toward designing systems and reusable behaviors.

This is the transition from:
“writing lines of code”
to
“building programs.”

Key Outcome:
The learner should finish Module 5 thinking:
“I can design and organize my own creations.”
```

I would also include one implementation philosophy section for the AI:

```text id="m0k9kj"
# UX and Teaching Principles

The application should prioritize:
- clarity over cleverness
- responsiveness over visual complexity
- experimentation over strict correctness
- creativity over rote memorization

Error messages should:
- reduce frustration
- explain problems clearly
- encourage retrying
- avoid harsh technical wording

Lessons should:
- be short
- avoid dense walls of text
- introduce one major idea at a time
- provide fast feedback
- connect concepts to creative outcomes

Projects should feel playful and open-ended.

The learner should frequently be encouraged to:
- modify examples
- remix projects
- experiment freely
- personalize outputs

The Sandbox Mode is a core part of the learning experience, not a secondary feature.

# Long-Term Vision

The ideal outcome is not simply that the learner completes lessons.

The ideal outcome is:
- the learner opens Sandbox Mode voluntarily
- experiments independently
- asks “what happens if…?”
- starts inventing projects
- sees programming as a creative tool

The curriculum should gradually reduce scaffolding over time, transitioning from:
guided learning
→ guided experimentation
→ independent creation.

