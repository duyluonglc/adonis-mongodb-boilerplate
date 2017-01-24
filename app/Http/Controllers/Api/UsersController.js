'use strict'
const User = use('App/Models/User')
const Venue = use('App/Models/Venue')
const Validator = use('Validator')
const Exceptions = use('Exceptions')
const Config = use('Config')
const Hash = use('Hash')

/**
 *
 * @class UsersController
 */
class UsersController {

  /**
   * Index
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   * @swagger
   * /users:
   *   get:
   *     tags:
   *       - User
   *     summary: Get users
   *     parameters:
   *       - name: query
   *         description: json string to query data
   *         in:  query
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: users
   *         schema:
   *           type: array
   *           items:
   *             schema:
   *               $ref: '#/definitions/User'
   */
  * index(request, response) {
    const query = request.getQuery()
    const users = yield User.limit(query.limit)
      .skip(query.skip)
      .find(query.where)
    return response.apiCollection(users)
  }

  /**
   * Store
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf UsersController
   *
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
  * store(request, response) {
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
    yield Mail.send('emails.verification', { user: user.get() }, (message) => {
      message.to(user.get('email'), user.get('name'))
      message.from(Config.get('mail.sender'))
      message.subject('Please Verify Your Email Address')
    })
    return response.apiCreated(user)
  }

  /**
   * Show
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
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
   *         description: json string to query data
   *         in:  query
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: user
   *         schema:
   *           $ref: '#/definitions/User'
   */
  * show(request, response) {
    const user = request.instance
    // const query = request.getQuery()

    return response.apiItem(user)
  }

  /**
   * Update
   *
   * @param {any} request
   * @param {any} response
   * @returns
   *
   * @memberOf UsersController
   *
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
  * update(request, response) {
    const userId = request.param('id')
    yield this.validate(request, User.rules(userId))

    const user = request.instance
    user.set(request.only('name', 'phone'))
    yield user.save()

    return response.apiCreated(user)
  }

  /**
   * Destroy
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
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
  * destroy(request, response) {
    const userId = request.param('id')
    const user = request.instance
    yield user.remove()
    return response.apiDeleted()
  }

  }

}

module.exports = UsersController
