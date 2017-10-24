'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class AccountNotVerifiedException extends LogicalException {
  static invoke (message) {
    return new this(message || 'Account not verified', 401, 'E_ACCOUNT_NOT_VERIFIED')
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
    session.withErrors({ email: error.message }).flashAll()
    await session.commit()
    response.redirect('/login')
  }
}

module.exports = AccountNotVerifiedException
