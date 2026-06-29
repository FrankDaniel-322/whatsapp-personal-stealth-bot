import fs from 'node:fs'
import path from 'node:path'

const pidFile = path.resolve('runtime', 'bot.pid')

if (!fs.existsSync(pidFile)) {
  console.log('El bot no parece estar encendido: no existe runtime/bot.pid.')
  process.exit(0)
}

const pid = Number(fs.readFileSync(pidFile, 'utf8').trim())

if (!Number.isInteger(pid) || pid <= 0) {
  fs.rmSync(pidFile, { force: true })
  console.log('PID invalido. Limpie runtime/bot.pid.')
  process.exit(0)
}

try {
  process.kill(pid, 'SIGTERM')
  fs.rmSync(pidFile, { force: true })
  console.log(`Bot apagado. PID: ${pid}`)
} catch (error) {
  fs.rmSync(pidFile, { force: true })
  console.log(`No pude apagar el PID ${pid}. Quizas ya estaba cerrado.`)
}
