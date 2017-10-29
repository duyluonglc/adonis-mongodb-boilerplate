'use strict'

const BaseValidator = require('./BaseValidator')

class StoreUser extends BaseValidator {
  get rules () {
    return {
      name: 'required|min:2|max:100',
      email: `required|email|unique:users,email`,
      password: 'required|min:6|max:255',
      language: 'in:en,vi'
    }
  }

  async authorize () {
    if (String(this.ctx.auth.user._id) !== this.ctx.instance._id) {
      this.ctx.response.unauthorized('Not authorized')
      return false
    }

    return true
  }
}

module.exports = StoreUser
