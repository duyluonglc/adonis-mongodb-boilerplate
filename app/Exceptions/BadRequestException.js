'use strict'

const { HttpException } = require('@adonisjs/generic-exceptions')

class BadRequestException extends HttpException {
  static invoke (message) {
    return new this(message || 'Invalid params', 400, 'E_BAD_REQUEST')
  }
  /**
   * Handle this exception by itself
   */
  async handle (error, { request, response, session }) {
    if (request.url().indexOf('/api/') === 0) {
      let json = {
        status: error.status,
        code: error.code,
        message: error.message
      }
      if (use('Env').get('NODE_ENV') === 'development') {
        json.traces = error.stack
      }
      return response.status(error.status).json(json)
    }
    session.withErrors({ error: error.message }).flashAll()
    await session.commit()
    response.redirect('/error')
  }
}

module.exports = BadRequestException
