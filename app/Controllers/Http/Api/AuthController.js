'use strict'
const BaseController = use('App/Controllers/Http/Api/BaseController')
const User = use('App/Models/User')
const AccountNotVerifiedException = use('App/Exceptions/AccountNotVerifiedException')
const LoginFailedException = use('App/Exceptions/LoginFailedException')
const ResourceNotFoundException = use('App/Exceptions/ResourceNotFoundException')
const BadRequestException = use('App/Exceptions/BadRequestException')
const ValidateErrorException = use('App/Exceptions/ValidateErrorException')
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
  async register ({ request, response }) {
    const user = new User(request.only(['name', 'email', 'password', 'locale']))
    const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
    user.merge({
      verificationToken,
      verified: false
    })
    await user.save()
    Mail.send('emails.verification', { user: user }, (message) => {
      message.to(user.email, user.name)
      message.from(Config.get('mail.sender'))
      message.subject('Please Verify Your Email Address')
    }).catch(error => console.log(error))
    return response.apiCreated(user)
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
  async login ({ request, response, auth }) {
    const email = request.input('email')
    const password = request.input('password')
    await this.validate(request.all(), { email: 'required', password: 'required' })
    // Attempt to login with email and password
    let data = null
    try {
      data = await auth.attempt(email, password)
      data.user = await User.findBy({ email })
    } catch (error) {
      console.log(error)
      throw LoginFailedException.invoke('Invalid email or password')
    }
    if (!data.user.verified) {
      throw AccountNotVerifiedException.invoke('Email is not verified')
    }
    response.apiSuccess(data)
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
  async logout ({ request, response, auth }) {
    await auth.logout()

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
  async socialLogin ({ request, response, auth, ally, params }) {
    const social = params.social
    await this.validate(request.all(), { socialToken: 'required|string' })
    await this.validate({ social }, { social: 'required|in:facebook,google' })
    const socialToken = request.input('socialToken')
    let socialUser = null
    try {
      socialUser = await ally.driver(social).fields(['name', 'email']).getUser(socialToken)
    } catch (error) {
      throw LoginFailedException.invoke('Invalid token')
    }
    const user = await User.findOrCreate({ email: socialUser.getEmail() }, {
      name: socialUser.getName(),
      email: socialUser.getEmail(),
      // locale: socialUser.locale.substring(2),
      verified: true,
      socialId: socialUser.getId(),
      password: use('uuid').v4(),
      avatar: socialUser.getAvatar()
    })
    const data = await auth.generate(user)
    data.user = user
    return response.apiSuccess(data)
  }

  /**
   * re-sends verification token to the users
   * email address.
   *
   * @param  {Object} request
   * @param  {Object} response
   *
   */
  async sendVerification ({ request, response }) {
    await this.validate(request.all(), { email: 'required' })
    const user = await User.findBy({ email: request.input('email') })
    if (!user) {
      throw ResourceNotFoundException.invoke(`Can not find user with email "${request.input('email')}"`)
    }
    const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
    user.verificationToken = verificationToken
    await user.save()
    response.apiSuccess(null, 'Email sent successfully')
    await Mail.send('emails.verification', { user: user }, (message) => {
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
  async verify ({ request, response, session }) {
    const token = request.input('token')
    const user = await User.findBy({ verificationToken: token })
    if (!user) {
      throw BadRequestException.invoke(`Invalid token`)
    }
    user.verified = true
    user.unset('verificationToken')
    await user.save()
    await session.flash({ message: 'Account verified successfully' })
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
  async me ({ request, response, auth }) {
    const user = await auth.getUser()
    return response.apiSuccess(user)
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
  async forgot ({ request, response }) {
    await this.validate(request.all(), { email: 'required' })
    const user = await User.findBy({ email: request.input('email') })
    if (!user) {
      throw ResourceNotFoundException.invoke(`Can not find user with email "${request.input('email')}"`)
    }
    const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
    user.verificationToken = verificationToken
    await user.save()

    response.apiSuccess(null, 'Email sent successfully')

    await Mail.send('emails.reset', { user: user }, (message) => {
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
  async getReset ({ request, view }) {
    const token = request.input('token')
    const user = await User.findBy({ verificationToken: token })
    if (!token || !user) {
      throw BadRequestException.invoke(`Invalid token`)
    }
    await view.render('emails.reset', { token: token })
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
  async postReset ({ request, response, session }) {
    const token = request.input('token')
    await this.validate(request.all(), {
      password: 'required|min:6|max:50',
      passwordConfirmation: 'same:password'
    })
    const password = request.input('password')
    const user = await User.findBy({ verificationToken: token })
    if (!token || !user) {
      throw BadRequestException.invoke(`Invalid token`)
    }
    const hashPassword = await Hash.make(password)
    user.password = hashPassword
    user.unset('verificationToken')
    await user.save()
    await session.flash({ message: 'Reset password successfully' })
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
  async password ({ request, response, auth }) {
    await this.validate(request.all(), { password: 'required', newPassword: 'required|min:6|max:50' })
    const password = request.input('password')
    const newPassword = request.input('newPassword')
    const user = await auth.getUser()
    const check = await Hash.verify(password, user.password)
    if (!check) {
      throw ValidateErrorException.invoke({ password: 'Password does not match' })
    }
    const hashPassword = await Hash.make(newPassword)
    user.set('password', hashPassword)
    user.unset('verificationToken')
    await user.save()
    response.apiSuccess(user, 'Change password successfully')
  }
}

module.exports = AuthController
