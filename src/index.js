import 'dotenv/config'
import { loadConfig } from './config.js'
import { startBot } from './core/bot.js'
import { startHealthServer } from './core/health.js'
import { logger } from './utils/logger.js'

const config = loadConfig()

startHealthServer(config)

startBot(config).catch((error) => {
  logger.error('Fatal startup error', error)
  process.exit(1)
})

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection', error)
})

process.on('uncaughtException', (error) => {
  if (!String(error?.message || '').includes('Bad MAC')) {
    logger.error('Uncaught exception', error)
  }
})
