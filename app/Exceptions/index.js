const Exceptions = require('node-exceptions')

class ResourceNotFoundException extends Exceptions.RuntimeException {
}

class ValidateErrorException extends Exceptions.RuntimeException {
}

class BadRequestException extends Exceptions.HttpException {
}

class UnAuthorizeException extends Exceptions.HttpException {
}

class LoginFailedException extends Exceptions.HttpException {
}

class AccountNotVerifiedException extends Exceptions.HttpException {
}

Exceptions.ResourceNotFoundException = ResourceNotFoundException
Exceptions.ValidateErrorException = ValidateErrorException
Exceptions.BadRequestException = BadRequestException
Exceptions.UnAuthorizeException = UnAuthorizeException
Exceptions.LoginFailedException = LoginFailedException
Exceptions.AccountNotVerifiedException = AccountNotVerifiedException

module.exports = Exceptions
