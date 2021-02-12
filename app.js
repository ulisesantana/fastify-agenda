import path from 'path'

export default async function app (server, opts) {
  server.register(import('fastify-autoload'), {
    dir: path.resolve('routes')
  })
}
