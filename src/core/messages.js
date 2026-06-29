import { openOnceCommand } from '../commands/openOnce.js'
import { getCommandText } from '../utils/media.js'
import { isOwnerMessage } from '../utils/identity.js'
import { logger } from '../utils/logger.js'

function normalizeTrigger(text) {
  return String(text || '').trim().replace(/\s+/g, ' ').toLowerCase()
}

function parseCommand(text, prefix) {
  if (!text.startsWith(prefix)) return null
  const withoutPrefix = text.slice(prefix.length).trim()
  if (!withoutPrefix) return null
  const [name, ...args] = withoutPrefix.split(/\s+/)
  return { name: name.toLowerCase(), args }
}

function isOpenOnceTrigger(text, config) {
  const normalized = normalizeTrigger(text)
  const command = parseCommand(normalized, config.prefix)

  if (command?.name === config.openOnceCommand) return true
  return config.openOnceAliases.includes(normalized)
}

export async function handleIncomingMessage(sock, msg, config) {
  if (!msg?.message) return

  const text = getCommandText(msg)
  if (!text) return

  if (!isOpenOnceTrigger(text, config)) return

  if (!isOwnerMessage(msg, sock, config)) {
    logger.warn('Ignored command from non-owner sender')
    return
  }

  await openOnceCommand({ sock, msg, config })
}
