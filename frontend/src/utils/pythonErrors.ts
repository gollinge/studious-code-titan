export const ERROR_HELP: Record<string, string> = {
  SyntaxError:
    "Python couldn't understand this line. Check your quotes, parentheses, or spelling.",
  NameError:
    "Python doesn't recognize that name. Did you create the variable first?",
  IndentationError:
    'The spacing on this line looks off. Try using the Tab key to indent.',
  TypeError:
    "Two things are being mixed up that don't go together — like a number and a word.",
  ValueError:
    "The value you gave doesn't work here. Double-check what you passed in.",
  AttributeError:
    "Python couldn't find that action on this thing. Check your spelling, and that you're using it on the right kind of value.",
  EOFError:
    "Python ran out of input. Did your program ask a question with input() but get no answer?",
  ZeroDivisionError:
    "You can't divide by zero — try a different number.",
  ModuleNotFoundError:
    "Python couldn't find that tool. Check the spelling, or it might not be allowed in this sandbox.",
  ConnectionError:
    "Couldn't reach the server. Make sure the backend is running.",
}

export function getFriendlyHelp(errorType: string | null, timedOut: boolean): string | null {
  if (timedOut) return 'Your program ran for too long. Does it have a loop that never stops?'
  if (!errorType) return null
  return ERROR_HELP[errorType] ?? null
}
