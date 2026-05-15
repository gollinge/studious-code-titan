import type { Lesson } from '../types'

export const lessons: Lesson[] = [
  {
    id: 'print',
    title: '1. print()',
    concept:
      'print() is a command that makes Python display a message on the screen. The parentheses () mean "do this action now." Anything you put inside quotes " " is text — and Python will show it exactly as you typed it.',
    starterCode: '# Write your first line of Python here\n',
    expectedOutput: 'Any message you like — just make Python say something!',
    progressiveHints: [
      '# Hint 1: Use print() with a message inside quotes\n# print( "your message here" )',
      'print("your message here")',
      'print("Hello, explorer!")\nprint("Python is fun!")',
    ],
    challenge:
      'Dive Deeper: Write a short poem using at least 4 print() calls — one line of the poem per print().',
  },
  {
    id: 'variables',
    title: '2. Variables',
    concept: 'Variables are labeled boxes that store information.',
    starterCode: 'name = "Ava"\nfavorite_snack = "apple slices"\nprint(name)\nprint(favorite_snack)',
    expectedOutput: 'Print the name and favorite snack.',
    hints: ['Rename the variables to your own choices.'],
  },
  {
    id: 'math',
    title: '3. Numbers and Math',
    concept: 'Python can do arithmetic like a super-fast calculator.',
    starterCode: 'stars = 7\nmore_stars = 5\nprint(stars + more_stars)\nprint(20 / 4)\nprint(3 * 6)',
    expectedOutput: 'Show addition, division, and multiplication results.',
  },
  {
    id: 'if',
    title: '4. if Statements',
    concept: 'if statements let your program make decisions.',
    starterCode:
      'weather = "sunny"\n\nif weather == "sunny":\n    print("Let\'s go outside!")\nelse:\n    print("Let\'s read a book!")',
    expectedOutput: 'Print one message depending on weather.',
  },
  {
    id: 'loops',
    title: '5. Loops',
    concept: 'Loops repeat code so you do not need to type the same line many times.',
    starterCode: 'for jump in range(1, 6):\n    print("Jump", jump)',
    expectedOutput: 'Print Jump 1 through Jump 5.',
    hints: ['Try changing 6 to 11 for a longer loop.'],
  },
  {
    id: 'functions',
    title: '6. Functions',
    concept: 'Functions are reusable mini-programs.',
    starterCode:
      'def cheer(name):\n    print("Go, " + name + "!")\n\ncheer("Team Turtle")\ncheer("Team Rocket")',
    expectedOutput: 'Call your function more than once.',
  },
  {
    id: 'lists',
    title: '7. Lists',
    concept: 'Lists store many values in order.',
    starterCode:
      'pets = ["cat", "dog", "goldfish"]\nprint(pets[0])\nfor pet in pets:\n    print("I like", pet)',
    expectedOutput: 'Print list items by index and loop.',
  },
  {
    id: 'turtle',
    title: '8. Turtle-style Drawing Ideas',
    concept:
      'Real turtle graphics need a GUI window, but we can practice the idea with text commands first.',
    starterCode:
      'commands = ["forward 50", "right 90", "forward 50", "right 90", "forward 50", "right 90", "forward 50"]\nfor command in commands:\n    print("Turtle:", command)',
    expectedOutput: 'Print step-by-step drawing commands for a square.',
    hints: ['Try designing commands for a triangle.'],
  },
]
