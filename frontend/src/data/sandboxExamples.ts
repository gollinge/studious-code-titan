import type { SandboxExample } from '../types'

export const sandboxExamples: SandboxExample[] = [
  {
    id: 'hello',
    title: 'Print messages',
    code: 'print("Hello from the sandbox!")\nprint("Try changing this text.")',
  },
  {
    id: 'vars',
    title: 'Variables',
    code: 'animal = "panda"\nage = 4\nprint(animal)\nprint(age)',
  },
  {
    id: 'math',
    title: 'Simple math',
    code: 'a = 9\nb = 3\nprint(a + b)\nprint(a - b)\nprint(a * b)',
  },
  {
    id: 'if',
    title: 'if statement',
    code: 'score = 8\nif score > 5:\n    print("Great job!")\nelse:\n    print("Keep practicing!")',
  },
  {
    id: 'loop',
    title: 'Loop',
    code: 'for number in range(1, 6):\n    print(number)',
  },
  {
    id: 'function',
    title: 'Function',
    code: 'def greet(name):\n    print("Hi", name)\n\ngreet("Coder")',
  },
]
