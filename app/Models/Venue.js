'use strict'

const Model = use('App/Models/Model')
const qs = use('qs')

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
 *       description:
 *         type: string
 *       status:
 *         type: string
 *         enum:
 *           - restaurant
 *           - bar
 *           - pub
 *       location:
 *         type: object
 *         properties:
 *           lng:
 *             type: number
 *           lat:
 *             type: number
 *       autoPolicy:
 *         type: boolean
 *         default: false
 *       hasBank:
 *         type: boolean
 *         default: false
 *       currency:
 *         type: string
 *         enum:
 *           - usd
 *           - jpy
 *           - vnd
 *
 *   Venue:
 *     allOf:
 *       - $ref: '#/definitions/NewVenue'
 *       - type: object
 *         required:
 *           - _id
 *         properties:
 *           _id:
 *             type: string
 *           user_id:
 *             type: string
 */
class Venue extends Model {

  static rules (scope) {
    return {
      type: 'required|in:restaurant,cafe,bar,club',
      name: `required|unique:venues,name,${qs.stringify(scope)}`,
      address: 'required',
      phone: 'required|min:8|max:20',
      status: 'in:enabled,disabled',
      location: 'required|object',
      'location.lng': 'required|range:-90,90',
      'location.lat': 'required|range:-180,180'
    }
  }

  static get hidden () {
    return []
  }

  owner () {
    return this.belongsTo('App/Models/User')
  }

}

module.exports = Venue
