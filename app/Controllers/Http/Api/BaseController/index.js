'use strict'
const Validator = use('Validator')
const Exceptions = use('Exceptions')
const _ = use('lodash')

class BaseController {
  async validate (data, rules, messages) {
    const validation = await Validator.validateAll(data, rules, messages)
    if (validation.fails()) {
      throw new Exceptions.ValidateErrorException(validation.messages())
    }
  }

  async validateAttributes (data, rules, messages) {
    rules = _.pick(rules, _.keys(data))
    await this.validate(data, rules, messages)
  }
}

module.exports = BaseController
