function redact(value) {
  return String(value)
    .replace(/\b\d{9,}\b/g, '[number]')
    .replace(/\b\d{8,}@(?:s\.whatsapp\.net|lid|g\.us)\b/g, '[jid]')
}

function formatArgs(args) {
  return args
    .map((arg) => {
      if (arg instanceof Error) return redact(arg.stack || arg.message)
      if (typeof arg === 'object') {
        try {
          return redact(JSON.stringify(arg))
        } catch {
          return '[object]'
        }
      }
      return redact(arg)
    })
    .join(' ')
}

function log(level, args) {
  const line = `[${new Date().toISOString()}] ${level.toUpperCase()} ${formatArgs(args)}`
  if (level === 'error') console.error(line)
  else console.log(line)
}

export const logger = {
  info: (...args) => log('info', args),
  warn: (...args) => log('warn', args),
  error: (...args) => log('error', args)
}
