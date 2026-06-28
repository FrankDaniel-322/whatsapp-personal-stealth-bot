import { getOwnerChatJid } from '../utils/identity.js'
import {
  buildOutgoingMedia,
  describeMedia,
  downloadQuotedMedia,
  getQuotedWAMessage
} from '../utils/media.js'
import { logger } from '../utils/logger.js'

async function notifyOwner(sock, ownerChatJid, text, config) {
  if (!config.sendOwnerStatus) return
  await sock.sendMessage(ownerChatJid, { text })
}

export async function openOnceCommand({ sock, msg, config }) {
  const ownerChatJid = getOwnerChatJid(config)
  const quoted = getQuotedWAMessage(msg)

  if (!quoted) {
    await notifyOwner(sock, ownerChatJid, 'Responde a una foto, video, audio o archivo de una sola vez con :o.', config)
    return true
  }

  try {
    const media = await downloadQuotedMedia(quoted, sock)
    const label = describeMedia(media.type)

    await notifyOwner(sock, ownerChatJid, `Replicando ${label}...`, config)
    await sock.sendMessage(ownerChatJid, buildOutgoingMedia(media))
    return true
  } catch (error) {
    logger.warn('Open-once replication failed', error)
    await notifyOwner(sock, ownerChatJid, 'No pude replicar ese mensaje. Puede haber expirado, ya fue abierto, o WhatsApp no entrego el contenido al bot.', config)
    return true
  }
}
