type StringComparator = (a: string, b: string) => boolean

export const comparators: Record<string, StringComparator> = {
  '==': (a, b) => a == b,
  '===': (a, b) => a === b,
  '!=': (a, b) => a != b,
  '!==': (a, b) => a !== b,
  '<': (a, b) => a < b,
  '<=': (a, b) => a <= b,
  '>': (a, b) => a > b,
  '>=': (a, b) => a >= b,
  contains: (a, b) => a.includes(b),
  'not-contains': (a, b) => !a.includes(b),
  'starts-with': (a, b) => a.startsWith(b),
  'ends-with': (a, b) => a.endsWith(b),
  'is-empty': (a) => a === '',
  'is-not-empty': (a) => a !== '',
}
