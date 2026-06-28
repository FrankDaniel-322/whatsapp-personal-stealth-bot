import makeWASocket, {
  fetchLatestBaileysVersion,
  useMultiFileAuthState
} from '@whiskeysockets/baileys'
import NodeCache from 'node-cache'
import pino from 'pino'
import { handleConnectionUpdate } from './connection.js'
import { handleIncomingMessage } from './messages.js'
import { logger } from '../utils/logger.js'

export async function startBot(config) {
  const retryCache = new NodeCache()
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionDir)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: config.logLevel === 'debug' ? 'debug' : 'silent' }),
    browser: ['Chrome', 'Desktop', '1.0.0'],
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

  logger.info(`Baileys version ${version.join('.')}`)
  return sock
}
