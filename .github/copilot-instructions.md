# Copilot Instructions

## Workflow

Follow this workflow for every piece of work, without exception.

### 1. Plan
- Review the relevant TODO items before touching any code.
- If the scope is unclear, ask a clarifying question before proceeding.
- Propose the list of files that will change and what will change in each. Wait for approval.

### 2. Implement
- Make the agreed changes.
- Check for compile/lint errors after each file edit and fix them before moving on.

### 3. Review
- Summarize what changed and why.
- Tell the user where to verify in the browser or terminal.
- **Do NOT mark any TODO items as complete yet.**

### 4. User Verification
- Wait for the user to confirm the change looks and works correctly.
- If there is feedback, address it and return to step 3.

### 5. Mark Complete & Commit
- Only after explicit user approval:
  - Mark the relevant TODO items as `[x]` in `TODO.md`.
  - Stage all changed files and commit with a short, descriptive message.
  - Push to the remote branch.

---

## Commit Convention

```
<type>: <short description>

Types: feat, fix, refactor, content, chore, docs
Examples:
  feat: add progressive hints UI to lesson panel
  content: rewrite lesson 1 concept and starter code
  chore: update TODO after lesson 1 verification
```

---

## General Rules

- Never mark a TODO complete without explicit user sign-off.
- Never push without user approval.
- Keep TODOs up to date — add new items as they come up during conversation.
- One checkpoint = one commit. Don't batch multiple unrelated changes into one commit.
- Always check for lint/type errors after editing TypeScript or Python files.
