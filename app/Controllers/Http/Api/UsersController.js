'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

const BaseController = require('./BaseController')
/** @type {typeof import('../../../Models/User')} */
const User = use('App/Models/User')
// const Validator = use('Validator')
const UnAuthorizeException = use('App/Exceptions/UnAuthorizeException')
// const Config = use('Config')
/**
 *
 * @class UsersController
 */
class UsersController extends BaseController {
  /**
   * Index
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index ({ request, response, decodeQuery }) {
    const users = await User.query(decodeQuery()).fetch()
    return response.apiCollection(users)
  }

  /**
   * Store
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
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
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async show ({ request, response, instance, decodeQuery }) {
    const user = instance
    // await user.related(decodeQuery().with).load()
    return response.apiItem(user)
  }

  /**
   * Update
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   */
  async update ({ request, response, params, instance, auth }) {
    const user = instance
    if (String(auth.user._id) !== String(user._id)) {
      throw UnAuthorizeException.invoke()
    }
    user.merge(request.only(['name', 'locale']))
    await user.save()
    return response.apiUpdated(user)
  }

  /**
   * Destroy
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ request, response, instance, auth }) {
    const user = instance
    if (String(auth.user._id) !== String(user._id)) {
      throw UnAuthorizeException.invoke()
    }
    await user.delete()
    return response.apiDeleted()
  }

  /**
   * Upload
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async upload ({ request, response, instance, auth }) {
    const user = instance
    if (String(auth.user._id) !== String(user._id)) {
      throw UnAuthorizeException.invoke()
    }
    const image = request.file('image', {
      maxSize: '2mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })
    const fileName = `${use('uuid').v1().replace(/-/g, '')}_${image.clientName}`
    await image.move(use('Helpers').publicPath('uploads'), { name: fileName })
    const filePath = `uploads/${fileName}`
    await user.images().create({ fileName, filePath })
    // await user.related('images').load()
    return response.apiUpdated(user)
  }

  /**
   * Get images of user
   *
   * @param {object} ctx
   * @param {AuthSession} ctx.auth
   * @param {Request} ctx.request
   */
  async images ({ request, response, instance, decodeQuery }) {
    const user = instance
    const images = await user.images().query(decodeQuery()).fetch()
    return response.apiCollection(images)
  }
}

module.exports = UsersController
