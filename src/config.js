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

export function loadConfig() {
  const ownerNumber = cleanNumber(process.env.OWNER_NUMBER)

  if (!ownerNumber) {
    throw new Error('OWNER_NUMBER is required. Copy .env.example to .env and set your WhatsApp number.')
  }

  const prefix = process.env.COMMAND_PREFIX || ':'
  const command = process.env.OPEN_ONCE_COMMAND || 'o'

  return {
    ownerName: process.env.OWNER_NAME || 'Owner',
    ownerNumber,
    ownerJids: readList('OWNER_JIDS'),
    ownerChatJid: process.env.OWNER_CHAT_JID || `${ownerNumber}@s.whatsapp.net`,
    prefix,
    openOnceCommand: command.toLowerCase(),
    sessionDir: path.resolve(process.env.SESSION_DIR || 'auth_session'),
    logLevel: process.env.LOG_LEVEL || 'info',
    sendOwnerStatus: readBoolean('SEND_OWNER_STATUS', true),
    pairingCode: readBoolean('PAIRING_CODE', true),
    healthServer: {
      enabled: readBoolean('ENABLE_HEALTH_SERVER', false),
      port: Number(process.env.PORT || 3000)
    }
  }
}
