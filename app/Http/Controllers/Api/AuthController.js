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
    yield this.validate(request.all(), User.rules())
    const user = new User(request.only('name', 'email', 'password'))
    const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
    user.fill({
      verificationToken: verificationToken,
      verified: false
    })
    yield user.save()
    response.apiCreated(user)
    yield Mail.send('emails.verification', { user: user }, (message) => {
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
    yield this.validate(request.all(), { email: 'required', password: 'required' })
    // Attempt to login with email and password
    const token = yield request.auth.attempt(email, password)
    const user = yield User.findBy({email})
    if (!user.verified) {
      throw new Exceptions.AccountNotVerifiedException('Email is not verified')
    }
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
    const network = request.param('social')
    yield this.validate(request.all(), {socialToken: 'required|string'})
    yield this.validate({social: request.param('social')}, {social: 'required|in:facebook,google'})
    const Social = use('Adonis/Auth/Social')
    const socialToken = request.input('socialToken')
    const socialUser = yield Social.verifyToken(network, socialToken)
    if (!socialUser) {
      throw new Exceptions.LoginFailedException('Invalid token')
    }
    let user = yield User.where('email', socialUser.email).first()
    if (!user) {
      user = yield User.create({
        name: socialUser.name,
        email: socialUser.email,
        language: socialUser.locale.substring(2),
        verified: true,
        socialId: socialUser.id,
        password: use('uuid').v4(),
        avatar: network === 'facebook' ? socialUser.picture.data.url : socialUser.picture
      })
    }
    user.token = yield request.auth.generate(user)
    return response.apiSuccess(user)
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
    yield this.validate(request.all(), { email: 'required' })
    const user = yield User.findBy({ email: request.input('email') })
    if (!user) {
      throw new Exceptions.ResourceNotFoundException(`Can not find user with email "${request.input('email')}"`)
    }
    const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
    user.verificationToken = verificationToken
    yield user.save()
    response.apiSuccess(null, 'Email sent successfully')
    yield Mail.send('emails.verification', { user: user }, (message) => {
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
    yield this.validate(request.all(), { email: 'required' })
    const user = yield User.findBy({ email: request.input('email') })
    if (!user) {
      throw new Exceptions.ResourceNotFoundException(`Can not find user with email "${request.input('email')}"`)
    }
    const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
    user.verificationToken = verificationToken
    yield user.save()

    response.apiSuccess(null, 'Email sent successfully')

    yield Mail.send('emails.reset', { user: user }, (message) => {
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
    if (!token || !user) {
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
    yield this.validate(request.all(), {
      password: 'required|min:6|max:50',
      passwordConfirmation: 'same:password'
    })
    const password = request.input('password')
    const user = yield User.findBy({ verificationToken: token })
    if (!token || !user) {
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
    yield this.validate(request.all(), { password: 'required', newPassword: 'required|min:6|max:50' })
    const password = request.input('password')
    const newPassword = request.input('newPassword')
    const user = request.authUser
    const check = yield Hash.verify(password, user.password)
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
