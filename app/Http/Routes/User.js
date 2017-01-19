'use strict'

/*
|--------------------------------------------------------------------------
| User Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route')

Route.group('user', () => {

  /**
   * @swagger
   * /users:
   *   post:
   *     tags:
   *       - User
   *     summary: Create users
   *     parameters:
   *       - name: body
   *         description: User object
   *         in:  body
   *         required: true
   *         type: object
   *         schema:
   *           $ref: '#/definitions/NewUser'
   *     responses:
   *       201:
   *         description: user
   *         schema:
   *           $ref: '#/definitions/User'
   */
  Route.post('/', 'Api/UsersController.store').middleware('auth')

  /**
   * @swagger
   * /users:
   *   get:
   *     tags:
   *       - User
   *     summary: Returns users
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/User'
   */
  Route.get('/', 'Api/UsersController.index')

  /**
  * @swagger
  * /users/{id}:
  *   get:
  *     tags:
  *       - User
  *     summary: Returns user
  *     parameters:
  *       - name: id
  *         description: Id of User object
  *         in:  path
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: user
  *         schema:
  *           $ref: '#/definitions/User'
  */
  Route.get('/:id', 'Api/UsersController.show')

  /**
  * @swagger
  * /users/{id}:
  *   put:
  *     tags:
  *       - User
  *     summary: Update users
  *     parameters:
  *       - name: id
  *         description: Id of User object
  *         in:  path
  *         required: true
  *         type: string
  *       - name: user
  *         description: User object
  *         in:  body
  *         required: true
  *         type: object
  *         schema:
  *           $ref: '#/definitions/NewUser'
  *     responses:
  *       202:
  *         description: user
  *         schema:
  *           $ref: '#/definitions/User'
  */
  Route.put('/:id', 'Api/UsersController.update').middleware('auth')

  /**
  * @swagger
  * /users/{id}:
  *   delete:
  *     tags:
  *       - User
  *     summary: Delete users
  *     parameters:
  *       - name: id
  *         description: Id of User object
  *         in:  path
  *         required: true
  *         type: string
  *     responses:
  *       202:
  *         description: delete success
  */
  Route.delete('/:id', 'Api/UsersController.destroy').middleware('auth')
}).prefix('/api/users')
