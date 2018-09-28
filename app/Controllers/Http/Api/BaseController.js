'use strict'
const Validator = use('Validator')
const ValidateErrorException = use('App/Exceptions/ValidateErrorException')
const _ = require('lodash')

class BaseController {
  async validate (data, rules, messages) {
    const validation = await Validator.validateAll(data, rules, messages)
    if (validation.fails()) {
      throw ValidateErrorException.invoke(validation.messages())
    }
  }

  async validateAttributes (data, rules, messages) {
    rules = _.pick(rules, _.keys(data))
    await this.validate(data, rules, messages)
  }
}

module.exports = BaseController
