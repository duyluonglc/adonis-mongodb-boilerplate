'use strict'
const Validator = use('Validator')
const Exceptions = use('Exceptions')

class BaseController {
  * validate(request, rules) {
    const validation = yield Validator.validateAll(request.all(), rules)
    if (validation.fails()) {
      throw new Exceptions.ValidateErrorException(validation.messages())
    }
  }

}

module.exports = BaseController
