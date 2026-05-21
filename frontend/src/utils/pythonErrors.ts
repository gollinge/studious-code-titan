export const ERROR_HELP: Record<string, string> = {
  SyntaxError:
    "Python couldn't understand this line. Check your quotes, parentheses, or spelling.",
  NameError:
    "Python doesn't recognise that name. Did you create the variable first?",
  IndentationError:
    'The spacing on this line looks off. Try using the Tab key to indent.',
  TypeError:
    "Two things are being mixed up that don't go together — like a number and a word.",
  ValueError:
    "The value you gave doesn't make sense in this context. Double-check what you passed in.",
  ConnectionError:
    "Couldn't reach the server. Make sure the backend is running.",
}

export function getFriendlyHelp(errorType: string | null, timedOut: boolean): string | null {
  if (timedOut) return 'Your program ran for too long. Does it have a loop that never stops?'
  if (!errorType) return null
  return ERROR_HELP[errorType] ?? null
}
