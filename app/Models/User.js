'use strict'

const Model = use('App/Models/Model')
const Hash = use('Hash')
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
 *   User:
 *     allOf:
 *       - $ref: '#/definitions/NewUser'
 *       - type: object
 *         required:
 *           - id
 *         properties:
 *           _id:
 *             type: string
 */
class User extends Model {

  static rules (id) {
    return {
      name: 'required',
      email: 'required|email|unique:users,email' + (id ? (`,_id,${id}`) : ''),
      password: 'required|min:6|max:255',
      language: `required|in:${languages.join(',')}`
    }
  }

  static get hidden () {
    return ['password', 'isDeleted', 'verificationToken']
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

  venues () {
    return this.hasMany('App/Models/Venue', '_id', 'user_id')
  }

}

module.exports = User
