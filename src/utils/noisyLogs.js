const ignoredPatterns = [
  'Failed to decrypt message with any known session',
  'Session error:Error: Bad MAC',
  'Error: Bad MAC'
]

function shouldIgnore(args) {
  const line = args.map((arg) => String(arg?.stack || arg?.message || arg)).join(' ')
  return ignoredPatterns.some((pattern) => line.includes(pattern))
}

const originalError = console.error.bind(console)
const originalWarn = console.warn.bind(console)

console.error = (...args) => {
  if (shouldIgnore(args)) return
  originalError(...args)
}

console.warn = (...args) => {
  if (shouldIgnore(args)) return
  originalWarn(...args)
}
