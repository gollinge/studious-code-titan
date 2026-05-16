````text id="6px7pr"
# Module 7 — Working with Collections

Module Type:
Core Concept Module

Primary Goal:
Teach learners how to store, organize, and work with groups of information using lists.

Educational Purpose:
This module introduces the idea that programs can manage collections of related data instead of isolated variables.

The learner should begin feeling:
- “My programs can remember lots of things.”
- “I can build inventories, teams, collections, and systems.”
- “My projects can become larger and more dynamic.”

This module should keep concepts concrete and highly visual.

Avoid abstract computer science explanations.

---

# Core Concepts

Primary concepts:
- lists
- list items
- indexing
- append()
- removing items
- iterating through lists
- list length

Secondary reinforcement:
- loops
- variables
- conditionals
- functions

Avoid initially:
- nested lists
- dictionaries
- list comprehensions
- slicing
- sorting algorithms
- advanced data structures

The module should prioritize:
- usefulness
- creativity
- visible outcomes

over technical completeness.

---

# Learner Mental Model

Introduce lists as:
“A container that can hold many pieces of information.”

Good examples:
- backpack inventory
- sports team roster
- pet collection
- shopping cart
- favorite games list
- spell collection

Avoid:
“A sequential mutable data structure.”

---

# Module Structure

Recommended lesson progression:
1. What Lists Are
2. Adding and Removing Items
3. Repeating Through Lists
4. Searching and Decisions
5. Building Collection Systems
6. Module Project

---

# Lesson 7a — What Lists Are

Goal:
Teach that one variable can store many related things.

Starter examples:
```python
pets = ["Dragon", "Dog", "Tiger"]
print(pets)
````

Topics:

* creating lists
* viewing lists
* list items
* list order

Activities:

* favorite foods
* favorite games
* creature teams
* sports rosters

Practical:
Create a themed collection.

---

# Lesson 7b — Adding and Removing Items

Goal:
Teach modifying collections dynamically.

Topics:

* append()
* remove()

Examples:

```python
inventory = ["Sword", "Shield"]

inventory.append("Potion")
inventory.remove("Shield")
```

Activities:

* adding treasure
* collecting creatures
* shopping cart updates

Practical:
Build a growing inventory system.

---

# Lesson 7c — Repeating Through Lists

Goal:
Combine loops and collections.

Topics:

* looping through lists
* repeated processing

Examples:

```python
pets = ["Dragon", "Dog", "Tiger"]

for pet in pets:
    print(pet)
```

Activities:

* announce team members
* display inventory
* print scores

Practical:
Create a “team introduction” system.

---

# Lesson 7d — Decisions with Collections

Goal:
Teach basic logic using lists.

Topics:

* checking for items
* list length
* simple conditions

Examples:

```python
inventory = ["Potion", "Key"]

if "Key" in inventory:
    print("The door unlocks!")
```

Activities:

* locked doors
* missing ingredients
* sports eligibility
* creature ownership checks

Practical:
Create a simple unlock/check system.

---

# Lesson 7e — Building Collection Systems

Goal:
Combine all collection concepts into useful systems.

Projects:

* backpack inventory
* creature collection tracker
* fantasy shop inventory
* sports lineup manager
* recipe ingredient tracker

This lesson should reduce scaffolding slightly.

Focus:

* organization
* experimentation
* personalization

---

# Module 7 Final Project — Collection-Based Mini System

Goal:
Create a program centered around managing a collection.

Allowed project ideas:

* inventory manager
* creature collector
* shopping system
* sports roster
* favorite games tracker
* music playlist simulator

Required concepts:

* at least one list
* adding/removing items
* loop through a list
* at least one conditional
* at least one function

Validation:
Flexible milestone-based validation only.

Avoid exact-output matching.

---

# UX Requirements

Collections should feel:

* visual
* concrete
* playful

Potential future UX ideas:

* visual list rendering
* inventory-style UI
* card-based displays
* creature grids
* drag-and-drop visualizations

Not required for MVP.

---

# Hint System Requirements

Hints should focus on:

* loop structure
* list syntax
* indexing mistakes
* append/remove usage

Examples should remain highly thematic and personalized.

Use learner interest themes whenever possible:

* sports
* fantasy
* animals
* shops
* robots
* games

---

# Error UX Requirements

Common beginner pain points:

* forgetting brackets
* quote mismatches
* indentation
* confusing list items vs strings

Error explanations should:

* explain visually
* reference examples
* avoid intimidating wording

---

# Educational Outcome

The learner should finish Module 7 feeling:

* “I can organize information.”
* “My programs can manage systems.”
* “I can build inventories and collections like real games.”

This module should feel like a major capability upgrade.

Collections should unlock larger project possibilities without overwhelming abstraction.

```
```
