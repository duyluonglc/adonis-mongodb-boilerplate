'use strict'

const Route = use('Route')
// const Config = use('Config')
const swaggerJSDoc = use('swagger-jsdoc')
/**
 * Swagger jsDoc
 */
Route.get('api-specs', async ({ request, response }) => {
  const options = {
    swaggerDefinition: {
      info: {
        title: 'My REST API', // Title (required)
        version: '1.0.0' // Version (required)
      },
      // host: `${Config.get('host')}:${Config.get('port')}`,
      basePath: '/api',
      securityDefinitions: {
        'JWT': {
          'type': 'apiKey',
          'description': "add 'Bearer ' before jwt token",
          'name': 'Authorization',
          'in': 'header'
        },
        'basicAuth': {
          'type': 'basic',
          'description': 'HTTP Basic Authentication. Works over `HTTP` and `HTTPS`'
        }
      }
    },
    apis: [
      './app/Routes/*.js',
      './app/Models/*.js'
    ] // Path to the API docs
  }
  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  return swaggerJSDoc(options)
}).as('swaggerSpec')

/**
 * Swagger UI
 */
Route.get('docs', ({ view }) => {
  return view.render('swagger')
}).as('swaggerUI')

/**
 * @swagger
 * parameters:
 *   Id:
 *     name: id
 *     description: id of instance
 *     in:  path
 *     required: true
 *     type: string
 *
 *   ListQuery:
 *     name: query
 *     description: '{ "where": { },  "with": ["string"], "select": ["string"], "limit": 20, "skip": 0, "sort": "string" }'
 *     in:  query
 *     required: false
 *     type: string
 *     #default: '{ "where": { },  "with": ["string"], "select": ["string"], "limit": 20, "skip": 0, "sort": "string" }'
 *
 *   SingleQuery:
 *     name: query
 *     description: '<pre>{ "with": ["string"], "select": ["string"] }</pre>'
 *     in:  query
 *     required: false
 *     type: string
 *     #default: '<pre>{ "with": ["string"], "select": ["string"] }</pre>'
 */
