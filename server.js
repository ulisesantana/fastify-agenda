import fastify from 'fastify'
import {
  generateSwaggerConfig,
  fastifyDevelopmentOptions,
  fastifyProductionOptions
} from './config/index.js'

const isDevEnv = process.env.NODE_ENV === 'development'
const PORT = +process.env.PORT || 3000
const docsRoute = process.env.COST_SIMULATOR_DOCS || '/docs'
const docsHost = `127.0.0.1:${PORT}`

const server = isDevEnv
  ? fastify(fastifyDevelopmentOptions)
  : fastify(fastifyProductionOptions)

if (isDevEnv) {
  server.register(import('fastify-swagger'), generateSwaggerConfig(docsHost, docsRoute))
  console.log(`Check ${docsRoute || '/docs'} for SwaggerUI`)
}

server.register(import('./app.js'))

async function start () {
  try {
    await server.listen(PORT)
  } catch (e) {
    console.error(e)
  }
}

start().catch(console.error)
