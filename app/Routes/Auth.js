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
   *     operationId: auth-register
   *     tags:
   *       - Auth
   *     summary: Register new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NewUser'
   *     responses:
   *       201:
   *         description: success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       422:
   *         $ref: '#/components/responses/ValidateFailed'
   */
  Route.post('/register', 'Api/AuthController.register')
    .validator('StoreUser')

  
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     operationId: auth-login
   *     tags:
   *       - Auth
   *     summary: Login to the application
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 required: true
   *               password:
   *                 type: string
   *                 required: true
   *     responses:
   *       200:
   *         description: login success
   *         content:
   *           application/json:
   *             schema:
   *               properties:
   *                 status:
   *                   type: number
   *                 message:
   *                   type: string
   *                 type:
   *                   type: string
   *                   default: bearer
   *                 token:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *                 user:
   *                   type: object
   *                   $ref: '#/components/schemas/User'
   *       422:
   *         $ref: '#/components/responses/ValidateFailed'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  Route.post('/login', 'Api/AuthController.login')

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     operationId: auth-logout
   *     tags:
   *       - Auth
   *     summary: Logout the application
   *     responses:
   *       200:
   *         description: logout success
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  Route.post('/logout', 'Api/AuthController.logout').middleware('auth:jwt')

  /**
   * @swagger
   * /auth/login/{social}:
   *   post:
   *     operationId: auth-social-login
   *     tags:
   *       - Auth
   *     summary: Social login
   *     parameters:
   *       - name: social
   *         description: social.
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *           enum:
   *             - facebook
   *             - google
   *             - twitter
   *             - linkedin
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               social_token:
   *                 type: string
   *                 required: true
   *     responses:
   *       200:
   *         description: login success
   *         content:
   *           application/json:
   *             schema:
   *               properties:
   *                 status:
   *                   type: number
   *                 message:
   *                   type: string
   *                 type:
   *                   type: string
   *                   default: bearer
   *                 token:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *                 user:
   *                   type: object
   *                   $ref: '#/components/schemas/User'
   *       422:
   *         $ref: '#/components/responses/ValidateFailed'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  Route.post('/login/:social', 'Api/AuthController.socialLogin')

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     operationId: auth-refresh
   *     tags:
   *       - Auth
   *     summary: Refresh token
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: number
   *               message:
   *                 type: string
   *               refresh_token:
   *                 type: string
   *                 required: true
   *     responses:
   *       200:
   *         description: refresh success
   *         content:
   *           application/json:
   *             schema:
   *               properties:
   *                 status:
   *                   type: number
   *                 message:
   *                   type: string
   *                 type:
   *                   type: string
   *                   default: bearer
   *                 token:
   *                   type: string
   *                 refreshToken:
   *                   type: string
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  Route.post('/refresh', 'Api/AuthController.refresh')

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     operationId: auth-me
   *     tags:
   *       - Auth
   *     summary: Get current user
   *     responses:
   *       200:
   *         description: Current user
   *         content:
   *           application/json:
   *             schema:
   *               status:
   *                 type: number
   *               message:
   *                 type: string
   *               data:
   *                 $ref: '#/components/schemas/User'
   *       422:
   *         $ref: '#/components/responses/ValidateFailed'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  Route.get('/me', 'Api/AuthController.me').middleware('auth:jwt')

  /**
   * @swagger
   * /auth/forgot:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Get email to reset password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 required: true
   *     responses:
   *       200:
   *         description: message
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  Route.post('/forgot', 'Api/AuthController.forgot')

  /**
   * @swagger
   * /auth/sendVerification:
   *   post:
   *     operationId: auth-send-verification
   *     tags:
   *       - Auth
   *     summary: Resend verification email
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 required: true
   *     responses:
   *       200:
   *         description: verify ok
   */
  Route.post('/sendVerification', 'Api/AuthController.sendVerification')

  /**
   * @swagger
   * /auth/password:
   *   post:
   *     operationId: auth-password
   *     tags:
   *       - Auth
   *     summary: Change password
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               password:
   *                 type: string
   *                 required: true
   *               new_password:
   *                 type: string
   *                 required: true
   *     responses:
   *       200:
   *         description: message
   *       422:
   *         $ref: '#/components/responses/ValidateFailed'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  Route.post('/password', 'Api/AuthController.password').middleware('auth:jwt')
}).prefix('/api/auth')

Route.get('auth/reset', 'Api/AuthController.getReset').as('reset')
Route.post('auth/reset', 'Api/AuthController.postReset')
Route.get('auth/verify', 'Api/AuthController.verify').as('verification')
