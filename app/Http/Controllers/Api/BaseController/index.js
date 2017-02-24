'use strict'
const Validator = use('Validator')
const Exceptions = use('Exceptions')
const _ = use('lodash')

class BaseController {
  * validate (data, rules, scope) {
    const validation = yield Validator.validateAll(data, rules)
    if (validation.fails()) {
      throw new Exceptions.ValidateErrorException(validation.messages())
    }
  }

  * validateAttributes (data, rules) {
    rules = _.pick(rules, _.keys(data))
    this.validate(data, rules)
  }

}

module.exports = BaseController
