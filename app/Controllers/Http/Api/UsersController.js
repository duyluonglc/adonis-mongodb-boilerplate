'use strict'
const BaseController = use('App/Controllers/Http/Api/BaseController')
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
  async index ({ request, response }) {
    const users = await User.query(request.getQuery()).fetch()
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
  // async store ({request, response}) {
  //   await this.validate(request.all(), User.rules())
  //   const user = new User(request.only('name', 'email'))
  //   const password = await Hash.make(request.input('password'))
  //   const verificationToken = crypto.createHash('sha256').update(uuid.v4()).digest('hex')
  //   user.set({
  //     password: password,
  //     verificationToken: verificationToken,
  //     verified: false
  //   })
  //   await user.save()
  //   await Mail.send('emails.verification', { user: user.get() }, (message) => {
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
  async show ({ request, response }) {
    const user = request.instance
    await user.related(request.getQuery().with).load()
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
  async update ({ request, response }) {
    const userId = request.param('id')
    await this.validateAttributes(request.all(), User.rules(userId))

    const user = request.instance
    user.fill(request.only('name', 'phone'))
    await user.save()

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
  async destroy ({ request, response }) {
    const user = request.instance
    await this.guard('owner', user)
    await user.delete()
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
  async upload ({ request, response }) {
    const File = use('File')
    const user = request.instance
    await this.guard('owner', user)
    const image = request.file('image', {
      maxSize: '2mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })
    const fileName = use('uuid').v1().replace('-', '') + image.clientName()
    const filePath = `uploads/${fileName}`
    await File.upload(fileName, image)
    await user.images().create({ fileName, filePath })
    await user.related('images').load()
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
  async images ({ request, response }) {
    const user = request.instance
    const images = await user.images().query(request.getQuery()).fetch()
    return response.apiCollection(images)
  }
}

module.exports = UsersController
