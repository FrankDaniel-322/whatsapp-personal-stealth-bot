import { DisconnectReason } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import qrcode from 'qrcode-terminal'
import { logger } from '../utils/logger.js'

let pairingCodeShown = false

export async function handleConnectionUpdate(update, sock, config, restart) {
  const { connection, lastDisconnect, qr } = update

  if (!sock.authState.creds.registered && qr) {
    logger.info('New QR generated')
    qrcode.generate(qr, { small: true })

    if (config.pairingCode && !pairingCodeShown) {
      try {
        const code = await sock.requestPairingCode(config.ownerNumber)
        const formatted = code.match(/.{1,4}/g)?.join('-') || code
        logger.info(`Pairing code: ${formatted}`)
        pairingCodeShown = true
      } catch (error) {
        logger.warn('Pairing code could not be generated', error)
      }
    }
  }

  if (connection === 'open') {
    logger.info('WhatsApp connection open')
    return
  }

  if (connection !== 'close') return

  const statusCode = lastDisconnect?.error instanceof Boom
    ? lastDisconnect.error.output.statusCode
    : undefined
  const shouldReconnect = statusCode !== DisconnectReason.loggedOut

  if (!shouldReconnect) {
    logger.error('Session logged out. Delete auth_session and pair again.')
    return
  }

  logger.warn('Connection closed. Reconnecting in 5 seconds.')
  setTimeout(restart, 5000)
}
