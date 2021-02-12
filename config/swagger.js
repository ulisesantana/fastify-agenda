export const generateSwaggerConfig = (
  docsHost = '127.0.0.1:3000',
  docsRoute = '/docs'
) => ({
  swagger: {
    info: {
      title: 'Contacts API',
      description: 'Contact Agenda.',
      version: '0.1.0'
    },
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  },
  host: docsHost,
  routePrefix: docsRoute,
  exposeRoute: true
})
