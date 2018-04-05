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
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   */
  Route.post('/register', 'Api/AuthController.register')
    .validator('StoreUser')

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Login to the application
   *     consumes:
   *       - "application/x-www-form-urlencoded"
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
   *         type: object
   *         properties:
   *           type:
   *             type: string
   *             default: bearer
   *           token:
   *             type: string
   *           refreshToken:
   *             type: string
   *           user:
   *             type: object
   *             $ref: '#/definitions/User'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   *       401:
   *         $ref: '#/responses/Unauthorized'
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
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.post('/logout', 'Api/AuthController.logout').middleware('auth:jwt')

  /**
   * @swagger
   * /auth/login/{social}:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Social login
   *     consumes:
   *       - "application/x-www-form-urlencoded"
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
   *         description: login success
   *         type: object
   *         properties:
   *           type:
   *             type: string
   *             default: bearer
   *           token:
   *             type: string
   *           refreshToken:
   *             type: string
   *           user:
   *             type: object
   *             $ref: '#/definitions/User'
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.post('/login/:social', 'Api/AuthController.socialLogin')

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Refresh token
   *     consumes:
   *       - "application/x-www-form-urlencoded"
   *     parameters:
   *       - name: refresh_token
   *         description: refresh token.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: refresh success
   *         type: object
   *         properties:
   *           type:
   *             type: string
   *             default: bearer
   *           token:
   *             type: string
   *           refreshToken:
   *             type: string
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.post('/refresh', 'Api/AuthController.refresh')

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
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.get('/me', 'Api/AuthController.me').middleware('auth:jwt')

  /**
   * @swagger
   * /auth/forgot:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Get email to reset password
   *     consumes:
   *       - "application/x-www-form-urlencoded"
   *     parameters:
   *       - name: email
   *         description: email.
   *         in: formData
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: message
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.post('/forgot', 'Api/AuthController.forgot')

  /**
   * @swagger
   * /auth/sendVerification:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Resend verification email
   *     consumes:
   *       - "application/x-www-form-urlencoded"
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
   *     consumes:
   *       - "application/x-www-form-urlencoded"
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
   *       422:
   *         $ref: '#/responses/ValidateFailed'
   *       401:
   *         $ref: '#/responses/Unauthorized'
   */
  Route.post('/password', 'Api/AuthController.password').middleware('auth:jwt')
}).prefix('/api/auth')

Route.get('auth/reset', 'Api/AuthController.getReset').as('reset')
Route.post('auth/reset', 'Api/AuthController.postReset')
Route.get('auth/verify', 'Api/AuthController.verify').as('verification')
