/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
'use strict'
const BaseController = require('./BaseController')
// const AccountNotVerifiedException = use('App/Exceptions/AccountNotVerifiedException')
const LoginFailedException = use('App/Exceptions/LoginFailedException')
const ResourceNotFoundException = use('App/Exceptions/ResourceNotFoundException')
const BadRequestException = use('App/Exceptions/BadRequestException')
const ValidateErrorException = use('App/Exceptions/ValidateErrorException')
const Config = use('Config')
const Hash = use('Hash')
const Mail = use('Mail')
const crypto = require('crypto')
const uuid = require('uuid')
const User = use('App/Models/User')

class AuthController extends BaseController {
  /**
   * Register
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
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
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
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
      data = await auth.authenticator('jwt').withRefreshToken().attempt(email, password)
      data.user = await User.findBy({ email })
    } catch (error) {
      console.log(error)
      throw LoginFailedException.invoke('Invalid email or password')
    }
    if (!data.user.verified) {
      // throw AccountNotVerifiedException.invoke('Email is not verified')
    }
    response.apiSuccess(data)
  }

  /**
   * Refresh token
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   * @returns
   *
   * @memberOf AuthController
   *
   */
  async refresh ({ request, response, auth }) {
    const authData = await auth
      .authenticator('jwt')
      .newRefreshToken()
      .generateForRefreshToken(request.input('refresh_token'))
    return response.json(authData)
  }

  /**
   * Logout
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
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
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   * @returns
   *
   * @memberOf AuthController
   *
   */
  async socialLogin ({ request, response, auth, ally, params }) {
    const social = params.social
    await this.validate({ social }, { social: 'required|in:facebook,google' })
    await this.validate(request.all(), { socialToken: 'required|string' })
    const socialToken = request.input('socialToken')
    let clientSecret = Config.get('services.ally')[social].clientSecret
    let socialUser = null
    try {
      socialUser = await ally.driver(social).getUserByToken(socialToken, clientSecret)
    } catch (error) {
      console.log(error)
      throw LoginFailedException.invoke('Invalid token')
    }
    let user = null
    if (socialUser.getEmail()) {
      user = await User.findOrCreate({ email: socialUser.getEmail() }, {
        name: socialUser.getName(),
        email: socialUser.getEmail(),
        verified: true,
        social_id: socialUser.getId(),
        password: use('uuid').v4(),
        avatar: socialUser.getAvatar()
      })
    } else if (socialUser.getOriginal().phone_number) {
      const userData = socialUser.getOriginal()
      user = await User.findOrCreate({ phone_number: userData.phone_number }, {
        name: userData.name,
        email: userData.email,
        verified: true,
        social_id: socialUser.getId(),
        password: use('uuid').v4(),
        avatar: socialUser.getAvatar()
      })
    } else {
      user = await User.findOrCreate({ social_id: socialUser.getId() }, {
        name: socialUser.getName(),
        email: socialUser.getEmail(),
        verified: true,
        social_id: socialUser.getId(),
        password: use('uuid').v4(),
        avatar: socialUser.getAvatar()
      })
    }
    const data = await auth.authenticator('jwt').generate(user)
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
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   * @returns
   *
   * @memberOf AuthController
   *
   */
  async me ({ request, response, auth }) {
    const user = auth.user
    return response.apiSuccess(user)
  }

  /**
   * Forgot
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
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
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
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
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
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
    user.password = password
    user.unset('verificationToken')
    await user.save()
    await session.flash({ message: 'Reset password successfully' })
    response.redirect('/')
  }

  /**
   * Change password
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {Request} ctx.request
   * @returns
   *
   * @memberOf AuthController
   *
   */
  async password ({ request, response, auth }) {
    await this.validate(request.all(), { password: 'required', newPassword: 'required|min:6|max:50' })
    const password = request.input('password')
    const newPassword = request.input('newPassword')
    const user = auth.user
    const check = await Hash.verify(password, user.password)
    if (!check) {
      throw ValidateErrorException.invoke({ password: 'Password does not match' })
    }
    user.password = newPassword
    user.unset('verificationToken')
    await user.save()
    response.apiSuccess(user, 'Change password successfully')
  }
}

module.exports = AuthController
