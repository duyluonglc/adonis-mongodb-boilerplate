'use strict'
const User = use('App/Models/User')
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
   */
  * store(request, response) {
    const validation = yield Validator.validateAll(request.all(), User.rules())
    if (validation.fails()) {
      throw new Exceptions.ValidateErrorException(validation.messages())
    }
    const user = new User(request.only('name', 'email'))
    const password = yield Hash.make(request.input('password'))
    user.set('password', password)
    yield user.save()
    return response.apiCreated(user)
  }

  /**
   * Show
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   */
  * show(request, response) {
    const userId = request.param('id')
    const user = yield User.findById(userId)
    if (!user) {
      throw new Exceptions.ResourceNotFoundException(`Cannot find user with id "${userId}"`)
    }
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
   */
  * update(request, response) {
    const userId = request.param('id')
    const validation = yield Validator.validateAll(request.all(), User.rules(userId))
    const user = yield User.findById(userId)
    if (!user) {
      throw new Exceptions.ResourceNotFoundException(`Cannot find user with id "${userId}"`)
    }

    if (validation.fails()) {
      throw new Exceptions.ValidateErrorException(validation.messages())
    }

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
   */
  * destroy(request, response) {
    const userId = request.param('id')
    const user = yield User.findById(userId)
    if (!user)
      throw new Exceptions.ResourceNotFoundException(`Cannot find user with id "${userId}"`)
    yield user.remove()
    return response.apiUpdated()
  }

  }

}

module.exports = UsersController
