import fs from 'node:fs'
import path from 'node:path'

const sessionDir = path.resolve(process.env.SESSION_DIR || 'auth_session')

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

if (!fs.existsSync(sessionDir)) {
  console.log('No existe auth_session. Inicia el bot y pide un codigo nuevo.')
  process.exit(0)
}

const backupDir = path.resolve(`${sessionDir}_backup_${stamp()}`)
fs.renameSync(sessionDir, backupDir)
console.log(`Sesion anterior movida a: ${backupDir}`)
console.log('Ahora ejecuta npm start para generar un codigo nuevo.')
