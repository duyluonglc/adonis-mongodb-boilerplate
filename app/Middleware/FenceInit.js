'use strict'

const { Gate, Guard } = use('@slynova/fence')
const _ = use('lodash')
const Helpers = use('Helpers')
const Policies = use('require-all')(Helpers.appRoot('app/Policies'))

class FenceInit {
  async handle (request, response, next) {
    _.map(Policies, Policy => {
      Gate.policy(Policy.model, new Policy())
    })
    const currentUser = request.currentUser || request.authUser
    Guard.setDefaultUser(currentUser)
    await next
  }
}

module.exports = FenceInit
