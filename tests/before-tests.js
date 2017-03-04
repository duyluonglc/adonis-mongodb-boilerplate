'use strict'
const request = require('supertest')
const co = require('co')
/*
|--------------------------------------------------------------------------
| Before Tests
|--------------------------------------------------------------------------
|
| This file will be executed before running all the tests
|
*/

const Ioc = use('adonis-fold').Ioc

/**
 * override the hash provider for faster tests, since
 * bcrypt is a slow algo.
 */
Ioc.bind('Adonis/Src/Hash', function () {
  return {
    verify: function * (value, oldValue) {
      return value === oldValue
    },
    make: function * (value) {
      return value
    }
  }
})

function * getJwtToken (user) {
  const AuthManager = use('Adonis/Src/AuthManager')
  const authManager = new AuthManager(use('Adonis/Src/Config'), {})
  return yield authManager.generate(user)
}

const oldEnd = request.Test.prototype.end
request.Test.prototype.login = function (user, authenticator) {
  this.adonisUser = user
  return this
}

request.Test.prototype.end = function () {
  const self = this
  const args = arguments
  if (this.adonisUser) {
    return co(function * () {
      const token = yield getJwtToken(self.adonisUser)
      self.set('Authorization', `Bearer ${token}`)
      return oldEnd.apply(self, args)
    })
  }
  return oldEnd.apply(this, args)
}
