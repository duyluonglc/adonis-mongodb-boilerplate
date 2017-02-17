'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider
const Exceptions = require('node-exceptions')

class ResourceNotFoundException extends Exceptions.RuntimeException {
}

class ValidateErrorException extends Exceptions.RuntimeException {
}

class BadRequestException extends Exceptions.HttpException {
}

class UnAuthorizeException extends Exceptions.HttpException {
}

class ExceptionsProvider extends ServiceProvider {

  * register () {
    // register bindings
    this.app.bind('Adonis/Provider/Exceptions', function () {
      Exceptions.ResourceNotFoundException = ResourceNotFoundException
      Exceptions.ValidateErrorException = ValidateErrorException
      Exceptions.BadRequestException = BadRequestException
      Exceptions.UnAuthorizeException = UnAuthorizeException
      return Exceptions
    })
  }

}

module.exports = ExceptionsProvider
