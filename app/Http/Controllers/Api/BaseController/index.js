'use strict'
const Validator = use('Validator')
const Exceptions = use('Exceptions')
const _ = use('lodash')
const Guard = require('node-fence').Guard

class BaseController {
  * validate (data, rules, scope) {
    const validation = yield Validator.validateAll(data, rules)
    if (validation.fails()) {
      throw new Exceptions.ValidateErrorException(validation.messages())
    }
  }

  * validateAttributes (data, rules) {
    rules = _.pick(rules, _.keys(data))
    yield this.validate(data, rules)
  }

  * guard (action, resource) {
    if (!_.isObject(resource)) {
      throw new Exceptions.InvalidArgumentException('Can not check permission of null')
    }
    const isAllowed = yield Guard.allows(action, resource)
    if (!isAllowed) {
      throw new Exceptions.UnAuthorizeException(`Access forbidden: You are not allowed to ${action} ${resource.constructor.name} ${resource._id}`)
    }
  }

}

module.exports = BaseController
