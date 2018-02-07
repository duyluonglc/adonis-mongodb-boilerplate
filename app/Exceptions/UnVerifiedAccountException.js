'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class UnVerifiedAccountException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = UnVerifiedAccountException
