'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class LoginFailedException extends LogicalException {
  static invoke (message) {
    return new this(message || 'Login failed', 401, 'E_LOGIN_FAILED')
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
    response.redirect('/login')
  }
}

module.exports = LoginFailedException
