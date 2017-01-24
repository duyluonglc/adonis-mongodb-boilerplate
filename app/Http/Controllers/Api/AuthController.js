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
   * @swagger
   * /auth/register:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Register new user
   *     parameters:
   *       - name: body
   *         description: JSON of user
   *         in:  body
   *         required: true
   *         type: object
   *         schema:
   *           $ref: '#/definitions/NewUser'
   *     responses:
   *       200:
   *         description: user
   *         schema:
   *           type: object
   *           $ref: '#/definitions/User'
   */
  * register(request, response) {
    yield this.validate(request, User.rules())
    const user = new User(request.only('name', 'email'))
    const password = yield Hash.make(request.input('password'))
    const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
    user.set({
      password: password,
      verificationToken: verificationToken,
      verified: false
    })
    yield user.save()
    response.apiCreated(user)
    yield Mail.send('emails.verification', { user: user.get() }, (message) => {
      message.to(user.get('email'), user.get('name'))
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
   * @swagger
   * /auth/login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Login to the application
   *     parameters:
   *       - name: email
   *         description: email to use for login.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: password
   *         description: User's password.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: login success
   *         schema:
   *           $ref: '#/definitions/User'
   */
  * login(request, response) {
    const email = request.input('email')
    const password = request.input('password')
    yield this.validate(request, { email: 'required', password: 'required' })
    // Attempt to login with email and password
    const token = yield request.auth.attempt(email, password)
    const user = yield User.findOne({ email })
    user.set({ token })
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
   * @swagger
   * /auth/logout:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Logout the application
   *     responses:
   *       200:
   *         description: logout success
   */
  * logout(request, response) {
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
   * @swagger
   * /auth/login/{social}:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Social login
   *     parameters:
   *       - name: social
   *         description: social.
   *         in: path
   *         required: true
   *         type: string
   *         enum:
   *           - facebook
   *           - google
   *           - twitter
   *           - linkedin
   *       - name: social_token
   *         description: social token.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: auth
   *         schema:
   *           $ref: '#/definitions/User'
   */
  * socialLogin(request, response) {
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
   * @swagger
   * /auth/sendVerification:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Resend verification email
   *     parameters:
   *       - name: email
   *         description: email.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: verify ok
   */
  * sendVerification(request, response) {
    yield this.validate(request, { email: 'required' })
    const user = yield User.findOne({ email: request.input('email') })
    if (!user) {
      throw new Exceptions.ResourceNotFoundException(`Can not find user with email "${request.input('email')}"`)
    }
    const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
    user.set('verificationToken', verificationToken)
    yield user.save()
    response.apiSuccess(null, 'Email sent successfully')
    yield Mail.send('emails.verification', { user: user.get() }, (message) => {
      message.to(user.get('email'), user.get('name'))
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
  * verify(request, response) {
    const token = request.input('token')
    const user = yield User.findOne({ verificationToken: token })
    if (!user) {
      throw new Exceptions.BadRequestException(`Invalid token`)
    }
    user.set('emailVerified', true)
    user.unset('verificationToken')
    const updateUser = yield user.save()
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
   * @swagger
   * /auth/me:
   *   get:
   *     tags:
   *       - Auth
   *     summary: Returns user
   *     responses:
   *       200:
   *         description: auth
   *         schema:
   *           $ref: '#/definitions/User'
   */
  * me(request, response) {
    const user = yield request.auth.getUser()

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
   * @swagger
   * /auth/forgot:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Get email to reset password
   *     parameters:
   *       - name: email
   *         description: email.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: message
   */
  * forgot(request, response) {
    yield this.validate(request, { email: 'required' })
    const user = yield User.findOne({ email: request.input('email') })
    if (!user) {
      throw new Exceptions.ResourceNotFoundException(`Can not find user with email "${request.input('email')}"`)
    }
    const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
    user.set('verificationToken', verificationToken)
    yield user.save()

    response.apiSuccess(null, 'Email sent successfully')

    yield Mail.send('emails.reset', { user: user.get() }, (message) => {
      message.to(user.get('email'), user.get('name'))
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
  * getReset(request, response) {
    const token = request.input('token')
    const user = yield User.findOne({ verificationToken: token })
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
   * @swagger
   * /auth/reset:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Reset password
   *     parameters:
   *       - name: verificationToken
   *         description: verificationToken.
   *         in: query
   *         required: true
   *         type: string
   *       - name: password
   *         description: password.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: message
   */
  * postReset(request, response) {
    const token = request.input('token')
    yield this.validate(request, { password: 'required|min:6|max:50' })
    const password = request.input('password')
    const user = yield User.findOne({ verificationToken: token })
    if (!user) {
      throw new Exceptions.BadRequestException(`Invalid token`)
    }
    const hashPassword = yield Hash.make(password)
    user.set('password', hashPassword)
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
   * @swagger
   * /auth/password:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Change password
   *     parameters:
   *       - name: password
   *         description: password.
   *         in: formData
   *         required: true
   *         type: string
   *       - name: newPassword
   *         description: newPassword.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: message
   */
  * password(request, response) {
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
    response.apiSuccess(updateUser, 'Change password successfully')
  }

}

module.exports = AuthController
