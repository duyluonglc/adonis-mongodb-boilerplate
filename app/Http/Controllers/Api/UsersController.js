'use strict'
const User = use('App/Models/User')
const Validator = use('Validator')
const Exceptions = use('App/Exceptions')
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
    const users = yield User.all()
    response.apiCollection(users)
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
    const validation = yield Validator.validateAll(request.all(), User.rules)
    if (!validation.fails()) {
      const exist = yield User.findOne({ email: request.input('email') })
      if (exist) {
        throw new Exceptions.ValidateErrorException([
          {
            "field": "email",
            "validation": "unique",
            "message": "Email already existed"
          }
        ])
      }
    }
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
    const user = yield User.findById(request.params().id)
    if (user)
      response.apiItem(user)
    else
      throw new Exceptions.ResourceNotFoundException(`Cannot find user with id "${request.params('id')}"`)
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
    const user = yield User.findById(request.param('id'))
    if (!user)
      throw new Exceptions.ResourceNotFoundException(`Cannot find user with id "${request.param('id')}"`)

    const validation = yield Validator.validateAll(request.all(), {
      name: 'min:1',
      language: `in:${Config.get('locale.languages').join(',')}`,
    })

    if (validation.fails()) {
      throw new Exceptions.ValidateErrorException(validation.messages())
    }

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
    const user = yield User.findById(request.param('id'))
    if (!user)
      throw new Exceptions.ResourceNotFoundException(`Cannot find user with id "${request.param('id')}"`)
    yield user.remove()
    response.apiUpdated()
  }

}

module.exports = UsersController
