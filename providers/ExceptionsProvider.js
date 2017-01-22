'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider
const Exceptions = require('node-exceptions')

class ResourceNotFoundException extends Exceptions.RuntimeException { }

class ValidateErrorException extends Exceptions.RuntimeException { }

class ExceptionsProvider extends ServiceProvider {

  * register() {
    // register bindings
    this.app.bind('Adonis/Provider/Exceptions', function () {
      Exceptions.ResourceNotFoundException = ResourceNotFoundException
      Exceptions.ValidateErrorException = ValidateErrorException
      return Exceptions
    })
  }

}

module.exports = ExceptionsProvider
