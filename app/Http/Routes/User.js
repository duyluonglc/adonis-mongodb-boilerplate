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
   * @\swagger
   * /users:
   *   get:
   *     tags:
   *       - User
   *     summary: Get users
   *     parameters:
   *       - name: query
   *         description: Query param with format json
   *         in:  query
   *         required: false
   *         type: object
   *         schema:
   *           $ref: '#/definitions/ListQuery'
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: array
   *           items:
   *             schema:
   *               $ref: '#/definitions/User'
   */
  // Route.get('/', 'Api/UsersController.index')

  /**
   * \@swagger
   * /users:
   *   post:
   *     tags:
   *       - User
   *     summary: Create user
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
  // Route.post('/', 'Api/UsersController.store')

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
   *       - name: query
   *         description: Query param with format json
   *         in:  query
   *         required: false
   *         type: object
   *         schema:
   *           $ref: '#/definitions/SingleQuery'
   *     responses:
   *       200:
   *         description: user
   *         schema:
   *           $ref: '#/definitions/User'
   */
  Route.get('/:id', 'Api/UsersController.show').middleware(['instance:App/Models/User'])

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
  Route.put('/:id', 'Api/UsersController.update').middleware(['auth:jwt,basic', 'instance:App/Models/User'])

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
  Route.delete('/:id', 'Api/UsersController.destroy').middleware(['auth:jwt,basic', 'instance:App/Models/User'])

  /**
   * @swagger
   * /users/{id}/upload:
   *   post:
   *     tags:
   *       - User
   *     summary: Upload images to user
   *     parameters:
   *       - name: id
   *         description: Id of User object
   *         in:  path
   *         required: true
   *         type: string
   *       - name: image
   *         description: image files
   *         in:  formData
   *         required: true
   *         type: file
   *     responses:
   *       200:
   *         description: upload success
   */
  Route.post('/:id/upload', 'Api/UsersController.upload').middleware(['auth:jwt,basic', 'instance:App/Models/User'])

  /**
   * @swagger
   * /users/{id}/images:
   *   get:
   *     tags:
   *       - User
   *     summary: Get images of user
   *     parameters:
   *       - name: id
   *         description: Id of User object
   *         in:  path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: success
   *         schema:
   *           $ref: '#/definitions/Image'
   */
  Route.get('/:id/images', 'Api/UsersController.images').middleware(['instance:App/Models/Venue'])

  /**
   * @swagger
   * /users/{id}/venues:
   *   get:
   *     tags:
   *       - User
   *     summary: Get venues by user
   *     parameters:
   *       - name: id
   *         description: Id of User object
   *         in:  path
   *         required: true
   *         type: string
   *       - name: query
   *         description: Query param with format json
   *         in:  query
   *         required: false
   *         type: object
   *         schema:
   *           $ref: '#/definitions/ListQuery'
   *     responses:
   *       200:
   *         description: venues
   *         schema:
   *           type: array
   *           items:
   *             schema:
   *               $ref: '#/definitions/Venue'
   */
  Route.get('/:id/venues', 'Api/UsersController.venues').middleware(['auth:jwt,basic', 'instance:App/Models/User'])
}).prefix('/api/users')
