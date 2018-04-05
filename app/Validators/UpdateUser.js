'use strict'

const BaseValidator = require('./BaseValidator')

class UpdateUser extends BaseValidator {
  get rules () {
    const userId = this.ctx.params.id
    return {
      name: 'min:2|max:100',
      email: `email|unique:users,email,_id,${userId}`,
      locale: 'in:en,vi'
    }
  }
}

module.exports = UpdateUser
