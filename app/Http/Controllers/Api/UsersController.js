'use strict'
const BaseController = use('App/Http/Controllers/Api/BaseController')
const User = use('App/Models/User')
// const Validator = use('Validator')
// const Exceptions = use('Exceptions')
// const Config = use('Config')
/**
 *
 * @class UsersController
 */
class UsersController extends BaseController {
  /**
   * Index
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  * index (request, response) {
    const users = yield User.query(request.getQuery()).fetch()
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
   */
  // * store (request, response) {
  //   yield this.validate(request.all(), User.rules())
  //   const user = new User(request.only('name', 'email'))
  //   const password = yield Hash.make(request.input('password'))
  //   const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
  //   user.set({
  //     password: password,
  //     verificationToken: verificationToken,
  //     verified: false
  //   })
  //   yield user.save()
  //   yield Mail.send('emails.verification', { user: user.get() }, (message) => {
  //     message.to(user.email, user.name)
  //     message.from(Config.get('mail.sender'))
  //     message.subject('Please Verify Your Email Address')
  //   })
  //   return response.apiCreated(user)
  // }

  /**
   * Show
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  * show (request, response) {
    const user = request.instance
    yield user.related(request.getQuery().with).load()
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
   */
  * update (request, response) {
    const userId = request.param('id')
    yield this.validateAttributes(request.all(), User.rules(userId))

    const user = request.instance
    yield this.guard('owner', user)
    user.set(request.only('name', 'phone'))
    yield user.save()

    return response.apiUpdated(user)
  }

  /**
   * Destroy
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  * destroy (request, response) {
    const user = request.instance
    yield this.guard('owner', user)
    yield user.delete()
    return response.apiDeleted()
  }

  /**
   * Upload
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  * upload (request, response) {
    const File = use('File')
    const user = request.instance
    yield this.guard('owner', user)
    const image = request.file('image', {
      maxSize: '2mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })
    const fileName = use('uuid').v1().replace('-', '') + image.clientName()
    const filePath = `uploads/${fileName}`
    yield File.upload(fileName, image)
    yield user.images().create({ fileName, filePath })
    yield user.related('images').load()
    return response.apiUpdated(user)
  }

  /**
   * Get images of user
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  * images (request, response) {
    const user = request.instance
    const images = yield user.images().query(request.getQuery()).fetch()
    return response.apiCollection(images)
  }

  /**
   * Venues
   *
   * @param {any} request
   * @param {any} response
   *
   * @memberOf UsersController
   *
   */
  * venues (request, response) {
    const venues = yield request.instance.venues().query(request.getQuery()).fetch()
    return response.apiCollection(venues)
  }
}

module.exports = UsersController
