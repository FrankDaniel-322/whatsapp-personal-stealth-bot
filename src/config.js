import path from 'node:path'

function cleanNumber(value = '') {
  return String(value).replace(/[^0-9]/g, '')
}

function readBoolean(name, fallback = false) {
  const value = process.env[name]
  if (value == null || value === '') return fallback
  return ['1', 'true', 'yes', 'y', 'on'].includes(String(value).toLowerCase())
}

function readList(name) {
  return String(process.env[name] || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function readNumber(name, fallback) {
  const value = Number(process.env[name])
  return Number.isFinite(value) && value >= 0 ? value : fallback
}

export function loadConfig() {
  const ownerNumber = cleanNumber(process.env.OWNER_NUMBER)

  if (!ownerNumber) {
    throw new Error('OWNER_NUMBER is required. Copy .env.example to .env and set your WhatsApp number.')
  }

  const prefix = process.env.COMMAND_PREFIX || ':'
  const command = process.env.OPEN_ONCE_COMMAND || 'o'
  const openOnceAliases = readList('OPEN_ONCE_ALIASES')

  return {
    ownerName: process.env.OWNER_NAME || 'Owner',
    ownerNumber,
    ownerJids: readList('OWNER_JIDS'),
    ownerChatJid: process.env.OWNER_CHAT_JID || `${ownerNumber}@s.whatsapp.net`,
    prefix,
    openOnceCommand: command.toLowerCase(),
    openOnceAliases: (openOnceAliases.length ? openOnceAliases : ['q riko', 'wao', 'waoo'])
      .map((item) => item.toLowerCase()),
    sessionDir: path.resolve(process.env.SESSION_DIR || 'auth_session'),
    logLevel: process.env.LOG_LEVEL || 'info',
    sendOwnerStatus: readBoolean('SEND_OWNER_STATUS', true),
    pairingCode: readBoolean('PAIRING_CODE', true),
    pairingCodeDelayMs: readNumber('PAIRING_CODE_DELAY_MS', 2500),
    healthServer: {
      enabled: readBoolean('ENABLE_HEALTH_SERVER', false),
      port: Number(process.env.PORT || 3000)
    }
  }
}
