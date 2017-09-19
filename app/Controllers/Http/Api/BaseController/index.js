'use strict'
const Validator = use('Validator')
const Exceptions = use('Exceptions')
const _ = use('lodash')
const { Guard } = require('@slynova/fence')

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

  async guard (action, resource) {
    if (!_.isObject(resource)) {
      throw new Exceptions.InvalidArgumentException('Can not check permission of null')
    }
    const isAllowed = await Guard.allows(action, resource)
    if (!isAllowed) {
      throw new Exceptions.UnAuthorizeException(`Access forbidden: You are not allowed to ${action} ${resource.constructor.name} ${resource._id}`)
    }
  }
}

module.exports = BaseController
