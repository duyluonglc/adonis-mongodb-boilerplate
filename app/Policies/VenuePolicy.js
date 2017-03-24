'use strict'

class VenuePolicy {
  static get model () {
    return use('App/Models/Venue')
  }

  * show (user, venue) {
    return (venue.userId.toString() === user._id.toString())
  }

  * update (user, venue) {
    return (venue.userId.toString() === user._id.toString())
  }

  * upload (user, venue) {
    return false
  }
}

module.exports = VenuePolicy
