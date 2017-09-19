'use strict'

class UserPolicy {
  static get model () {
    return use('App/Models/User')
  }

  async update (user, target) {
    return user._id.toString() === target._id.toString()
  }
}

module.exports = UserPolicy
