'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class ValidateErrorException extends LogicalException {
  static invoke (errors) {
    const error = new this('Validate failed', 422, 'E_VALIDATE_FAILED')
    error.errors = errors
    return error
  }
  /**
   * Handle this exception by itself
   */
  async handle (error, { request, response, session }) {
    if (request.url().indexOf('/api/') === 0) {
      return response.validateFailed(error.errors)
    }

    session.withErrors(error.errors).flashAll()
    await session.commit()
    response.redirect('back')
  }
}

module.exports = ValidateErrorException
