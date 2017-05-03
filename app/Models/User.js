'use strict'

const Model = use('LucidMongo')
const Config = use('Config')
const languages = Config.get('locale.languages')

/**
 * @swagger
 * definitions:
 *   NewUser:
 *     type: object
 *     required:
 *       - name
 *       - email
 *       - password
 *     properties:
 *       name:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *       language:
 *         type: string
 *         enum:
 *           - en
 *           - ja
 *           - vi
 *   UpdateUser:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *       language:
 *         type: string
 *         enum:
 *           - en
 *           - ja
 *           - vi
 *   User:
 *     allOf:
 *       - $ref: '#/definitions/NewUser'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 */
class User extends Model {
  // timestamp
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }
  static get deleteTimestamp () { return 'deletedAt' }

  static rules (userId) {
    return {
      name: 'required',
      email: `required|email|unique:users,email` + (userId ? `,_id,${userId}` : ''),
      password: 'required|min:6|max:255',
      language: `required|in:${languages.join(',')}`
    }
  }

  static get hidden () {
    return ['password', 'isDeleted', 'verificationToken']
  }

  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'App/Models/Hooks/User.encryptPassword')
  }

  tokens () {
    return this.hasMany('App/Models/Token', '_id', 'userId')
  }

  images () {
    return this.morphMany('App/Models/Image', 'imageableType', 'imageableId')
  }

  venues () {
    return this.hasMany('App/Models/Venue', '_id', 'userId')
  }
}

module.exports = User
