const GE = require('@adonisjs/generic-exceptions')

class ResourceNotFoundException extends GE.RuntimeException {
}

class ValidateErrorException extends GE.RuntimeException {
}

class BadRequestException extends GE.HttpException {
}

class UnAuthorizeException extends GE.HttpException {
}

class LoginFailedException extends GE.HttpException {
}

class AccountNotVerifiedException extends GE.HttpException {
}

GE.ResourceNotFoundException = ResourceNotFoundException
GE.ValidateErrorException = ValidateErrorException
GE.BadRequestException = BadRequestException
GE.UnAuthorizeException = UnAuthorizeException
GE.LoginFailedException = LoginFailedException
GE.AccountNotVerifiedException = AccountNotVerifiedException

module.exports = GE
