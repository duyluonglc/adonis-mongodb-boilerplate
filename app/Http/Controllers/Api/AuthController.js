'use strict'
const BaseController = use('App/Http/Controllers/Api/BaseController')
const User = use('App/Models/User')
const Exceptions = use('Exceptions')
const Config = use('Config')
const Hash = use('Hash')
const Mail = use('Mail')
const crypto = use('crypto')
const uuid = use('uuid')

/**
 *
 * @class AuthController
 */
class AuthController extends BaseController {

  /**
   * Register
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf UsersController
   *
   */
  * register (request, response) {
    yield this.validate(request, User.rules())
    const user = new User(request.only('name', 'email'))
    const password = yield Hash.make(request.input('password'))
    const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
    user.fill({
      password: password,
      verificationToken: verificationToken,
      verified: false
    })
    yield user.save()
    response.apiCreated(user)
    yield Mail.send('emails.verification', { user: user.get() }, (message) => {
      message.to(user.email, user.name)
      message.from(Config.get('mail.sender'))
      message.subject('Please Verify Your Email Address')
    })
  }

  /**
   * Login
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf AuthController
   *
   */
  * login (request, response) {
    const email = request.input('email')
    const password = request.input('password')
    yield this.validate(request, { email: 'required', password: 'required' })
    // Attempt to login with email and password
    const token = yield request.auth.attempt(email, password)
    const user = yield User.findBy({email})
    user.token = token
    response.apiSuccess(user)
  }

  /**
   * Logout
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf AuthController
   *
   */
  * logout (request, response) {
    yield request.auth.logout()

    return response.send('success')
  }

  /**
   * Social login
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf AuthController
   *
   */
  * socialLogin (request, response) {
    const social = request.param('social')
    const socialUser = yield request.ally.driver(social).getUser()

    return response.apiSuccess(socialUser)
  }

  /**
   * re-sends verification token to the users
   * email address.
   *
   * @param  {Object} request
   * @param  {Object} response
   *
   */
  * sendVerification (request, response) {
    yield this.validate(request, { email: 'required' })
    const user = yield User.findBy({ email: request.input('email') })
    if (!user) {
      throw new Exceptions.ResourceNotFoundException(`Can not find user with email "${request.input('email')}"`)
    }
    const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
    user.verificationToken = verificationToken
    yield user.save()
    response.apiSuccess(null, 'Email sent successfully')
    yield Mail.send('emails.verification', { user: user.get() }, (message) => {
      message.to(user.email, user.name)
      message.from(Config.get('mail.sender'))
      message.subject('Please Verify Your Email Address')
    })
  }

  /**
   * verifies a user account with a give
   * token
   *
   * @param  {Object} request
   * @param  {Object} response
   */
  * verify (request, response) {
    const token = request.input('token')
    const user = yield User.findBy({ verificationToken: token })
    if (!user) {
      throw new Exceptions.BadRequestException(`Invalid token`)
    }
    user.verified = true
    user.unset('verificationToken')
    yield user.save()
    yield request.with({ message: 'Account verified successfully' }).flash()
    response.redirect('/')
  }

  /**
   * Me
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf AuthController
   *
   */
  * me (request, response) {
    return response.apiSuccess(request.authUser)
  }

  /**
   * Forgot
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf AuthController
   *
   */
  * forgot (request, response) {
    yield this.validate(request, { email: 'required' })
    const user = yield User.findBy({ email: request.input('email') })
    if (!user) {
      throw new Exceptions.ResourceNotFoundException(`Can not find user with email "${request.input('email')}"`)
    }
    const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
    user.verificationToken = verificationToken
    yield user.save()

    response.apiSuccess(null, 'Email sent successfully')

    yield Mail.send('emails.reset', { user: user.get() }, (message) => {
      message.to(user.email, user.name)
      message.from(Config.get('mail.sender'))
      message.subject('Reset your password')
    })
  }

  /**
   * Reset password form
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf AuthController
   *
   */
  * getReset (request, response) {
    const token = request.input('token')
    const user = yield User.findBy({ verificationToken: token })
    if (!user) {
      throw new Exceptions.BadRequestException(`Invalid token`)
    }
    yield response.sendView('reset', { token: token })
  }

  /**
   * Reset password
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf AuthController
   *
   */
  * postReset (request, response) {
    const token = request.input('token')
    yield this.validate(request, { password: 'required|min:6|max:50' })
    const password = request.input('password')
    const user = yield User.findBy({ verificationToken: token })
    if (!user) {
      throw new Exceptions.BadRequestException(`Invalid token`)
    }
    const hashPassword = yield Hash.make(password)
    user.password = hashPassword
    user.unset('verificationToken')
    yield user.save()
    yield request.with({ message: 'Reset password successfully' }).flash()
    response.redirect('/')
  }

  /**
   * Change password
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf AuthController
   *
   */
  * password (request, response) {
    yield this.validate(request, { password: 'required', newPassword: 'required|min:6|max:50' })
    const password = request.input('password')
    const newPassword = request.input('newPassword')
    const user = yield request.auth.getUser()
    const check = yield Hash.verify(password, user.get('password'))
    if (!check) {
      throw new Exceptions.ValidateErrorException('Password does not match')
    }
    const hashPassword = yield Hash.make(newPassword)
    user.set('password', hashPassword)
    user.unset('verificationToken')
    yield user.save()
    response.apiSuccess(user, 'Change password successfully')
  }

}

module.exports = AuthController
