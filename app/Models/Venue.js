'use strict'

const Model = use('App/Models/Model')
const Hash = use('Hash')
const Config = use('Config')
const languages = Config.get('locale.languages')

/**
 * @swagger
 * definitions:
 *   NewVenue:
 *     type: object
 *     required:
 *       - type
 *       - name
 *       - address
 *       - phone
 *     properties:
 *       type:
 *         type: string
 *         enum:
 *           - restaurant
 *           - bar
 *           - pub
 *       name:
 *         type: string
 *       address:
 *         type: string
 *       phone:
 *         type: string
 *       location:
 *         type: object
 *         properties:
 *           lng:
 *             type: number
 *           lat:
 *             type: number
 *
 *   Venue:
 *     allOf:
 *       - $ref: '#/definitions/NewVenue'
 *       - type: object
 *         required:
 *           - id
 *         properties:
 *           _id:
 *             type: string
 *           user_id:
 *             type: string
 */
class Venue extends Model {

  static rules(id) {
    return {
      type: 'required|in:restaurant,bar,club',
      name: 'required|unique:venues,name' + (id ? (`,_id,${id}`) : ''),
      address: 'required',
      phone: 'required|min:8|max:20',
      status: 'in:enabled,disabled',
      location: 'required|object',
      'location.lng': 'required|range:-90,90',
      'location.lat': 'required|range:-180,180',
    }
  }

  static get hidden() {
    return []
  }

  user() {
    return this.hasMany('App/Models/User')
  }

}

module.exports = Venue
