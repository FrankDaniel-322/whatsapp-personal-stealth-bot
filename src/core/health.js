import http from 'node:http'
import { logger } from '../utils/logger.js'

export function startHealthServer(config) {
  if (!config.healthServer.enabled) return

  const server = http.createServer((req, res) => {
    if (req.url !== '/health') {
      res.writeHead(404)
      res.end('not found')
      return
    }

    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' })
    res.end('ok')
  })

  server.listen(config.healthServer.port, () => {
    logger.info(`Health server listening on ${config.healthServer.port}`)
  })
}
