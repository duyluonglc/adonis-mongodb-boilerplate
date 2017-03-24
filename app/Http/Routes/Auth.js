'use strict'

/*
|--------------------------------------------------------------------------
| Auth Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route')

Route.group('auth', () => {
  /**
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
   *         schema:
   *           $ref: '#/definitions/NewUser'
   *     responses:
   *       201:
   *         description: user
   *         schema:
   *           $ref: '#/definitions/User'
   */
  Route.post('/register', 'Api/AuthController.register')

  /**
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
  Route.post('/login', 'Api/AuthController.login')

  /**
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
  Route.post('/logout', 'Api/AuthController.logout').middleware('auth:jwt,basic')

  /**
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
   *       - name: socialToken
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
  Route.post('/login/:social', 'Api/AuthController.socialLogin').middleware('ally')

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     tags:
   *       - Auth
   *     summary: Get current user
   *     responses:
   *       200:
   *         description: auth
   *         schema:
   *           $ref: '#/definitions/User'
   */
  Route.get('/me', 'Api/AuthController.me').middleware('auth:jwt,basic')

  /**
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
  Route.post('/forgot', 'Api/AuthController.forgot')

  /**
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
  Route.post('/sendVerification', 'Api/AuthController.sendVerification')

  /**
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
  Route.post('/password', 'Api/AuthController.password').middleware('auth:jwt,basic')
}).prefix('/api/auth')

Route.get('auth/reset', 'Api/AuthController.getReset').as('reset')
Route.post('auth/reset', 'Api/AuthController.postReset')
Route.get('auth/verify', 'Api/AuthController.verify').as('verification')
