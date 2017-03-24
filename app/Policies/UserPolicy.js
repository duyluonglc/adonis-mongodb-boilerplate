'use strict'

class VenuePolicy {

  static get model () {
    return use('App/Models/User')
  }

  * owner (user, target) {
    return user._id.toString() === target._id.toString()
  }
}

module.exports = VenuePolicy
