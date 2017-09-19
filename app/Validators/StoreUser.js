'use strict'

class StoreUser {
  get rules () {
    return {
      name: 'required|min:2|max:100',
      email: 'required|email|unique:users,email',
      password: 'required|min:6|max:255'
    }
  }
}

module.exports = StoreUser
