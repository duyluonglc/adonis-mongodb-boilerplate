'use strict'
const User = use('App/Models/User')
const Validator = use('Validator')
const Exceptions = use('App/Exceptions')
const Config = use('Config')
const Hash = use('Hash')

/**
 *
 * @class AuthController
 */
class AuthController {

  /**
   * Login
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf AuthController
   */
  * login(request, response) {
    const email = request.input('email')
    const password = request.input('password')

    // Attempt to login with email and password
    const token = yield request.auth.attempt(email, password)
    const user = yield User.findOne({ email })
    user.set({ token })
    response.apiSuccess([user.toJson()])

  }

  /**
   * Logout
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf AuthController
   */
  * logout(request, response) {
    yield request.auth.logout()

    return response.send('success')
  }

  /**
   * Me
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf AuthController
   */
  * me(request, response) {
    const user = yield request.auth.getUser()

    return response.apiSuccess([user.toJson()])
  }


  /**
   * Social login
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf AuthController
   */
  * socialLogin(request, response) {
    const social = request.param('social')
    const socialUser = yield request.ally.driver(social).getUser()

    return response.apiSuccess([socialUser.toJson()])
  }

}

module.exports = AuthController
