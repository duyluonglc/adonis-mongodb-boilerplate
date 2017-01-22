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

  static rules(id) {
    return {
      name: 'required',
      email: 'required|email|unique:users,email' + (id ? (`,_id,${id}`) : ''),
      password: 'required|min:6|max:255'
    }
  }

  static get hidden() {
    return ['password', 'emailVerified', 'isDeleted']
  }

  // configure() {
  //   /**
  //    * Hashing password before storing to the
  //    * database.
  //    */
  //   this.before('save', function* (next) {
  //     this.password = yield Hash.make(String(this.password))
  //     // yield next
  //   })
  // }

  apiTokens() {
    return this.hasMany('App/Models/Token')
  }

}

module.exports = User
