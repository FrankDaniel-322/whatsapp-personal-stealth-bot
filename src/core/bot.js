import makeWASocket, {
  Browsers,
  fetchLatestBaileysVersion,
  useMultiFileAuthState
} from '@whiskeysockets/baileys'
import NodeCache from 'node-cache'
import pino from 'pino'
import { handleConnectionUpdate } from './connection.js'
import { handleIncomingMessage } from './messages.js'
import { logger } from '../utils/logger.js'

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function requestPairingCodeIfNeeded(sock, config) {
  if (!config.pairingCode || sock.authState.creds.registered) return

  await delay(config.pairingCodeDelayMs)

  if (sock.authState.creds.registered) return

  try {
    const code = await sock.requestPairingCode(config.ownerNumber)
    const formatted = code.match(/.{1,4}/g)?.join('-') || code
    logger.info(`Pairing code: ${formatted}`)
    logger.info('On your main WhatsApp phone: Linked devices > Link device > Link with phone number instead.')
  } catch (error) {
    logger.error('Pairing code failed. Check OWNER_NUMBER, remove old auth_session with npm run relink, then try again.', error)
  }
}

export async function startBot(config) {
  const retryCache = new NodeCache()
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionDir)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: config.logLevel === 'debug' ? 'debug' : 'silent' }),
    browser: Browsers.ubuntu('Chrome'),
    markOnlineOnConnect: false,
    printQRInTerminal: false,
    msgRetryCounterCache: retryCache,
    syncFullHistory: false,
    generateHighQualityLinkPreview: false
  })

  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', (update) => {
    handleConnectionUpdate(update, sock, config, () => startBot(config))
  })
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    for (const msg of messages) {
      await handleIncomingMessage(sock, msg, config)
    }
  })

  await requestPairingCodeIfNeeded(sock, config)

  logger.info(`Baileys version ${version.join('.')}`)
  return sock
}
