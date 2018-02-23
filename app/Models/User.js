'use strict'

const Model = use('Model')
// const Config = use('Config')
// const languages = Config.get('locale.languages')

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
 *       phone:
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

  static get hidden () {
    return ['password', 'verified', 'verificationToken']
  }

  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'User.hashPassword')
  }

  tokens () {
    return this.hasMany('App/Models/Token', '_id', 'userId')
  }

  images () {
    return this.morphMany('App/Models/Image', 'imageableType', 'imageableId')
  }
}

module.exports = User
