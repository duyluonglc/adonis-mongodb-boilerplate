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
  Route.post('/logout', 'Api/AuthController.logout').middleware('auth')

  /**
   * @swagger
   * /auth/login/{social}:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Returns user
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
  Route.post('/login/:social', 'Api/AuthController.socialLogin')


  /**
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
  Route.get('/me', 'Api/AuthController.me').middleware('auth')

}).prefix('/api/auth')
