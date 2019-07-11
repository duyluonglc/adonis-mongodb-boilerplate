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
   *   get:
   *     tags:
   *       - User
   *     summary: Get users
   *     parameters:
   *       - $ref: '#/components/parameters/ListQuery'
   *     responses:
   *       200:
   *         description: users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                   $ref: '#/components/schemas/User'
   */
   Route.get('/', 'Api/UsersController.index')

  /**
   * \@swagger
   * /users:
   *   post:
   *     tags:
   *       - User
   *     summary: Create user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NewUser'
   *     responses:
   *       200:
   *         description: user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
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
   *       - $ref: '#/components/parameters/Id'
   *       - $ref: '#/components/parameters/SingleQuery'
   *     responses:
   *       200:
   *         description: user
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  Route.get('/:id', 'Api/UsersController.show')
    .instance('App/Models/User')

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     tags:
   *       - User
   *     summary: Update users
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NewUser'
   *     responses:
   *       202:
   *         description: update success
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       422:
   *         $ref: '#/components/responses/ValidateFailed'
   */
  Route.put('/:id', 'Api/UsersController.update')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')
    .validator('UpdateUser')

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     tags:
   *       - User
   *     summary: Delete users
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *     responses:
   *       202:
   *         description: delete success
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   */
  Route.delete('/:id', 'Api/UsersController.destroy')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')

  /**
   * @swagger
   * /users/{id}/upload:
   *   post:
   *     tags:
   *       - User
   *     summary: Upload images to user
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               image:
   *                 required: true
   *                 type: string
   *                 format: binary
   *               is_avatar:
   *                 required: false
   *                 type: boolean
   *     responses:
   *       200:
   *         description: upload success
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       422:
   *         $ref: '#/components/responses/ValidateFailed'
   */
  Route.post('/:id/upload', 'Api/UsersController.upload')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')

  /**
    * @\swagger
    * /users/{id}/images/{imageId}/setFeatured:
    *   put:
    *     tags:
    *       - User
    *     summary: set featured image
    *     parameters:
    *       - $ref: '#/components/parameters/Id'
    *       - name: imageId
    *         description: Id of Image object
    *         in:  path
    *         required: true
    *         type: string
    *     responses:
    *       200:
    *         description: update success
    */
  // Route.put('/:id/images/:imageId/setFeatured', 'Api/UsersController.setFeatured').middleware(['auth:jwt', 'instance:App/Models/User'])

  /**
   * @swagger
   * /users/{id}/images/{imageId}:
   *   delete:
   *     tags:
   *       - User
   *     summary: Delete an image
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *       - name: imageId
   *         description: Id of Image object
   *         in:  path
   *         required: true
   *         type: string
   *     responses:
   *       200:
   *         description: delete success
   *       404:
   *         $ref: '#/components/responses/NotFound'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   */
  Route.delete('/:id/images/:imageId', 'Api/UsersController.deleteImage')
    .middleware(['auth:jwt'])
    .instance('App/Models/User')

  /**
   * @swagger
   * /users/{id}/images:
   *   get:
   *     tags:
   *       - User
   *     summary: Get images of user
   *     parameters:
   *       - $ref: '#/components/parameters/Id'
   *     responses:
   *       200:
   *         description: success
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Image'
   *       404:
   *         $ref: '#/components/responses/NotFound'
   */
  Route.get('/:id/images', 'Api/UsersController.images')
    .instance('App/Models/User')
}).prefix('/api/users')
