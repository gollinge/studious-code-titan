# Interest-Adaptive Lesson Content

Priority:
Medium (high educational value, not required for MVP)

Goal:
Increase engagement, retention, and creative investment by adapting lesson themes, examples, prompts, and projects to the learner’s interests.

Core Idea:
The programming concepts remain identical, but the presentation layer changes based on the learner’s selected interests.

Examples:
- A learner interested in video games sees health bars, treasure, enemies, and quests.
- A learner interested in animals sees pets, habitats, rescues, and creature behaviors.
- A learner interested in sports sees scores, teams, timers, and tournaments.
- A learner interested in shops/businesses sees inventory, coins, customers, and products.

The educational structure should remain stable while the thematic framing changes.

---

# Educational Rationale

Children learn more effectively when:
- examples feel personally relevant
- outputs are emotionally engaging
- projects connect to existing interests
- they feel ownership over creations

The system should make coding feel like a tool for expressing interests, not a disconnected academic task.

This feature is intended to:
- increase motivation
- reduce disengagement
- encourage experimentation
- improve lesson completion
- increase Sandbox usage
- support creative remixing

---

# Initial UX Flow

During onboarding:
- Ask learner to choose interests.
- Allow multiple selections.
- Allow changing interests later.

Example interests:
- Video games
- Animals
- Sports
- Fantasy/adventure
- Space
- Robots
- Art/design
- Music
- Food/cooking
- Vehicles
- Dinosaurs
- Minecraft-style building
- Shops/businesses

Store selections locally.

---

# Personalization Scope

The system should adapt:
- variable names
- printed outputs
- challenge prompts
- project themes
- example stories
- quiz wording
- optional project ideas

The system should NOT change:
- core concepts
- lesson ordering
- lesson difficulty
- curriculum progression
- technical learning goals

Example:
Same variable lesson:

Generic:
```python
name = "Alex"
score = 100
````

Video game themed:

```python
player = "Knight"
health = 100
```

Animal themed:

```python
animal = "Tiger"
energy = 100
```

Sports themed:

```python
team = "Sharks"
score = 3
```

The underlying concept remains identical.

---

# Content Architecture Recommendation

Separate:

1. Educational concept structure
2. Thematic content generation

Suggested model:

* lesson templates define concepts
* theme packs provide contextual replacements

Example:

```ts
interface ThemePack {
  id: string;
  displayName: string;

  variableExamples: string[];
  projectIdeas: string[];
  outputExamples: string[];
  storyFragments: string[];
}
```

Lesson templates should reference interchangeable thematic content rather than hardcoded examples.

---

# Future Expansion Ideas

Potential future capabilities:

* learner-created themes
* favorite projects tracking
* adaptive challenge suggestions
* “remix this project” prompts
* dynamic sandbox starter code
* seasonal/event themes
* multi-interest blending

Examples:

* “sports + robots”
* “animals + fantasy”
* “space + cooking”

---

# Important Constraints

Personalization should:

* remain lightweight
* avoid overwhelming the learner
* avoid becoming gimmicky
* never block lesson progression
* never require accounts/cloud infrastructure

The app should still function completely without personalization enabled.

---

# Long-Term Goal

The learner should increasingly feel:
“Programming helps me create things I care about.”

Thematic personalization is intended to strengthen emotional connection to coding and encourage independent exploration outside structured lessons.

