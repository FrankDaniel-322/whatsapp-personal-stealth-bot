import { areJidsSameUser, jidNormalizedUser } from '@whiskeysockets/baileys'

export function cleanNumber(value = '') {
  return String(value).replace(/[^0-9]/g, '')
}

export function bareJid(jid = '') {
  const value = String(jid || '')
  if (!value.includes('@')) return value
  const [left, server] = value.split('@')
  return `${left.replace(/:.*/, '')}@${server}`
}

export function normalizeJid(jid = '') {
  const bare = bareJid(jid)
  try {
    return jidNormalizedUser(bare)
  } catch {
    return bare
  }
}

export function jidCandidates(jid = '') {
  const normalized = normalizeJid(jid)
  const number = cleanNumber(normalized.split('@')[0])
  const candidates = new Set([jid, bareJid(jid), normalized].filter(Boolean))

  if (number) {
    candidates.add(number)
    candidates.add(`${number}@s.whatsapp.net`)
    candidates.add(`${number}@lid`)
  }

  return [...candidates]
}

export function sameUser(a, b) {
  if (!a || !b) return false
  try {
    if (areJidsSameUser(normalizeJid(a), normalizeJid(b))) return true
  } catch {}

  const left = new Set(jidCandidates(a))
  return jidCandidates(b).some((candidate) => left.has(candidate))
}

export function getSenderJid(msg) {
  return msg.key.participant || msg.participant || msg.key.remoteJid
}

export function getOwnerChatJid(config) {
  return config.ownerChatJid || `${config.ownerNumber}@s.whatsapp.net`
}

export function isConfiguredOwner(jid, config, sock) {
  if (!jid) return false
  const ownerJids = [
    `${config.ownerNumber}@s.whatsapp.net`,
    `${config.ownerNumber}@lid`,
    ...config.ownerJids
  ]

  const ownSocketJids = [
    sock?.user?.id,
    sock?.user?.jid,
    sock?.user?.lid && `${cleanNumber(sock.user.lid)}@lid`
  ].filter(Boolean)

  return [...ownerJids, ...ownSocketJids].some((ownerJid) => sameUser(jid, ownerJid))
}

export function isOwnerMessage(msg, sock, config) {
  if (msg.key.fromMe) return true
  return isConfiguredOwner(getSenderJid(msg), config, sock)
}

export function resolveParticipant(participants = [], targetJid, sock) {
  const targetCandidates = new Set(jidCandidates(targetJid))

  for (const participant of participants) {
    const id = participant.id || participant.jid
    if (!id) continue
    if (jidCandidates(id).some((candidate) => targetCandidates.has(candidate))) {
      return participant
    }
    if (sameUser(id, targetJid)) return participant
  }

  const socketId = sock?.user?.id || sock?.user?.jid
  if (socketId && sameUser(targetJid, socketId)) {
    return participants.find((participant) => sameUser(participant.id || participant.jid, socketId))
  }

  return null
}
