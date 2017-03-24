'use strict'

const Guard = use('node-fence').Guard
const Gate = use('node-fence').Gate
const _ = use('lodash')
const Policies = use('require-all')(`${use('Helpers').appPath()}/Policies`)

class FenceInit {
  * handle (request, response, next) {
    _.map(Policies, Policy => {
      Gate.policy(Policy.model, new Policy())
    })
    const currentUser = request.currentUser || request.authUser
    Guard.setDefaultUser(currentUser)
    yield next
  }
}

module.exports = FenceInit
