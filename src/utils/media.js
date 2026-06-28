import { downloadMediaMessage } from '@whiskeysockets/baileys'

const WRAPPERS = [
  'ephemeralMessage',
  'viewOnceMessage',
  'viewOnceMessageV2',
  'viewOnceMessageV2Extension',
  'documentWithCaptionMessage'
]

const MEDIA_TYPES = new Set([
  'imageMessage',
  'videoMessage',
  'audioMessage',
  'documentMessage',
  'stickerMessage'
])

export function unwrapMessageContent(message = {}) {
  let current = message

  for (let depth = 0; depth < 8 && current; depth += 1) {
    const wrapper = WRAPPERS.find((key) => current[key]?.message)
    if (!wrapper) break
    current = current[wrapper].message
  }

  const type = Object.keys(current || {}).find((key) => key !== 'messageContextInfo')
  return { type, content: type ? current[type] : null, message: current }
}

function findContextInfo(message = {}) {
  const { message: unwrapped } = unwrapMessageContent(message)

  for (const value of Object.values(unwrapped || {})) {
    if (value?.contextInfo) return value.contextInfo
  }

  return null
}

export function getCommandText(msg) {
  const { type, content } = unwrapMessageContent(msg.message)
  if (type === 'conversation') return content || ''
  if (type === 'extendedTextMessage') return content?.text || ''
  if (type === 'imageMessage' || type === 'videoMessage') return content?.caption || ''
  return ''
}

export function getQuotedWAMessage(msg) {
  const contextInfo = findContextInfo(msg.message)
  const quotedMessage = contextInfo?.quotedMessage
  if (!quotedMessage) return null

  const participant = contextInfo.participant || msg.key.participant

  return {
    key: {
      remoteJid: msg.key.remoteJid,
      id: contextInfo.stanzaId,
      participant,
      fromMe: false
    },
    message: quotedMessage
  }
}

export function describeMedia(type) {
  if (type === 'imageMessage') return 'imagen'
  if (type === 'videoMessage') return 'video'
  if (type === 'audioMessage') return 'audio'
  if (type === 'documentMessage') return 'archivo'
  if (type === 'stickerMessage') return 'sticker'
  return 'mensaje'
}

export async function downloadQuotedMedia(quoted, sock) {
  const { type, content } = unwrapMessageContent(quoted.message)

  if (!MEDIA_TYPES.has(type)) {
    throw new Error(`Quoted message is not supported media: ${type || 'unknown'}`)
  }

  const mediaMessage = {
    key: quoted.key,
    message: {
      [type]: content
    }
  }

  const buffer = await downloadMediaMessage(
    mediaMessage,
    'buffer',
    {},
    sock?.updateMediaMessage
      ? {
          logger: sock.logger,
          reuploadRequest: (message) => sock.updateMediaMessage(message)
        }
      : undefined
  )

  if (!buffer?.length) {
    throw new Error('Downloaded media buffer is empty')
  }

  return { type, content, buffer }
}

export function buildOutgoingMedia(media) {
  const { type, content, buffer } = media

  if (type === 'imageMessage') {
    return {
      image: buffer,
      caption: content.caption || undefined
    }
  }

  if (type === 'videoMessage') {
    return {
      video: buffer,
      gifPlayback: Boolean(content.gifPlayback),
      caption: content.caption || undefined,
      mimetype: content.mimetype || 'video/mp4'
    }
  }

  if (type === 'audioMessage') {
    return {
      audio: buffer,
      ptt: Boolean(content.ptt),
      mimetype: content.mimetype || 'audio/mp4'
    }
  }

  if (type === 'documentMessage') {
    return {
      document: buffer,
      fileName: content.fileName || 'archivo',
      mimetype: content.mimetype || 'application/octet-stream',
      caption: content.caption || undefined
    }
  }

  if (type === 'stickerMessage') {
    return {
      sticker: buffer
    }
  }

  throw new Error(`Cannot build outgoing media for ${type}`)
}
