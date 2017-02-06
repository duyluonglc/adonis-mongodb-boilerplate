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
 * definitions:
 *   ListQuery:
 *     type: object
 *     properties:
 *       where:
 *         type: object
 *       with:
 *         type: array
 *         items:
 *           type:
 *             string
 *       select:
 *         type: array
 *         items:
 *           type:
 *             string
 *       limit:
 *         type: number
 *         default: 20
 *       skip:
 *         type: number
 *         default: 0
 *       sort:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   SingleQuery:
 *     type: object
 *     properties:
 *       with:
 *         type: array
 *         items:
 *           type:
 *             string
 *       select:
 *         type: array
 *         items:
 *           type:
 *             string
 */
