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
   *       - $ref: '#/parameters/ListQuery'
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: array
   *           items:
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
   *         schema:
   *           $ref: '#/definitions/NewUser'
   *     responses:
   *       200:
   *         description: user
   *         schema:
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
   *       - $ref: '#/parameters/Id'
   *       - $ref: '#/parameters/SingleQuery'
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
   *       - $ref: '#/parameters/Id'
   *       - name: user
   *         description: User object
   *         in:  body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/UpdateUser'
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
   *       - $ref: '#/parameters/Id'
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
   *       - $ref: '#/parameters/Id'
   *       - name: image
   *         description: image files
   *         in:  formData
   *         required: true
   *         type: file
   *       - name: isAvatar
   *         description: isAvatar
   *         in:  formData
   *         required: false
   *         type: boolean
   *     responses:
   *       200:
   *         description: upload success
   */
  Route.post('/:id/upload', 'Api/UsersController.upload').middleware(['auth:jwt,basic', 'instance:App/Models/User'])

  /**
    * @swagger
    * /users/{id}/images/{imageId}/setFeatured:
    *   put:
    *     tags:
    *       - User
    *     summary: set featured image
    *     parameters:
    *       - $ref: '#/parameters/Id'
    *       - name: imageId
    *         description: Id of Image object
    *         in:  path
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: update success
    */
  Route.put('/:id/images/:imageId/setFeatured', 'Api/UsersController.setFeatured').middleware(['auth:jwt,basic', 'instance:App/Models/User'])

  /**
    * @swagger
    * /users/{id}/images/{imageId}:
    *   delete:
    *     tags:
    *       - User
    *     summary: Delete an image
    *     parameters:
    *       - $ref: '#/parameters/Id'
    *       - name: imageId
    *         description: Id of Image object
    *         in:  path
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: delete success
    */
  Route.delete('/:id/images/:imageId', 'Api/UsersController.deleteImage').middleware(['auth:jwt,basic', 'instance:App/Models/User'])

  /**
   * @swagger
   * /users/{id}/images:
   *   get:
   *     tags:
   *       - User
   *     summary: Get images of user
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *     responses:
   *       200:
   *         description: success
   *         schema:
   *           type: array
   *           items:
   *           $ref: '#/definitions/Image'
   */
  Route.get('/:id/images', 'Api/UsersController.images').middleware(['instance:App/Models/User'])

  /**
   * @swagger
   * /users/{id}/venues:
   *   get:
   *     tags:
   *       - User
   *     summary: Get venues by user
   *     parameters:
   *       - $ref: '#/parameters/Id'
   *       - $ref: '#/parameters/ListQuery'
   *     responses:
   *       200:
   *         description: venues
   *         schema:
   *           type: array
   *           items:
   *               $ref: '#/definitions/Venue'
   */
  Route.get('/:id/venues', 'Api/UsersController.venues').middleware(['auth:jwt,basic', 'instance:App/Models/User'])

}).prefix('/api/users')
