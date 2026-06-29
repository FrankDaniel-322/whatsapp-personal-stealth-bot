import fs from 'node:fs'
import path from 'node:path'

const runtimeDir = path.resolve('runtime')
const pidFile = path.join(runtimeDir, 'bot.pid')

export function registerRuntime() {
  fs.mkdirSync(runtimeDir, { recursive: true })
  fs.writeFileSync(pidFile, String(process.pid), 'utf8')

  const cleanup = () => {
    try {
      if (fs.existsSync(pidFile) && fs.readFileSync(pidFile, 'utf8').trim() === String(process.pid)) {
        fs.rmSync(pidFile, { force: true })
      }
    } catch {}
  }

  process.once('exit', cleanup)
  process.once('SIGINT', () => {
    cleanup()
    process.exit(0)
  })
  process.once('SIGTERM', () => {
    cleanup()
    process.exit(0)
  })
}
