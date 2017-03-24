'use strict'

const Route = use('Route')
const swaggerJSDoc = use('swagger-jsdoc')

/**
 * Swagger jsDoc
 */
Route.get('api-docs.json', function * (request, response) {
  const options = {
    swaggerDefinition: {
      info: {
        title: 'iOrder', // Title (required)
        version: '1.0.0' // Version (required)
      },
      host: `${use('Config').get('app.host')}:${use('Config').get('app.port')}`,
      basePath: '/api',
      securityDefinitions: {
        'jwt': {
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
    apis: ['./app/Http/Routes/*.js', './app/Http/Controllers/Api/*.js', './app/Models/*.js'] // Path to the API docs
  }
  // Initialize swagger-jsdoc -> returns validated swagger spec in json format
  return response.json(swaggerJSDoc(options))
}).as('swaggerSpec')

/**
 * Swagger UI
 */
Route.get('docs', function * (request, response) {
  yield response.sendView('swaggerUI')
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
