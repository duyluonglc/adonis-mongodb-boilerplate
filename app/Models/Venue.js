'use strict'

const Model = use('LucidMongo')
const Config = use('Config')

/**
 * @swagger
 * definitions:
 *   NewVenue:
 *     type: object
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
 *           - enabled
 *           - disabled
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
 *       chatEnabled:
 *         type: boolean
 *         default: false
 *       currency:
 *         type: string
 *         enum:
 *           - usd
 *           - jpy
 *           - eur
 *
 *   Venue:
 *     allOf:
 *       - $ref: '#/definitions/NewVenue'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 *           user_id:
 *             type: string
 *           hasBank:
 *             type: boolean
 *             default: false
 */
class Venue extends Model {
  // timestamp
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }
  static get deleteTimestamp () { return 'deletedAt' }
  // model constant
  static get STATUS_ENABLED () { return 'enabled' }
  static get STATUS_DISABLED () { return 'disabled' }

  static get rules () {
    return {
      type: 'required|in:restaurant,cafe,bar,club',
      name: 'required',
      address: 'required',
      phone: 'required|min:8|max:20',
      currency: `required|in:${Config.get('locale.currencies')}`,
      status: `required|in:${Venue.STATUS_ENABLED},${Venue.STATUS_DISABLED}`,
      chatEnabled: 'boolean',
      location: 'required|object',
      'location.lat': 'required|range:-90,90',
      'location.lng': 'required|range:-180,180'
    }
  }

  static get geoFields () {
    return ['location']
  }

  owner () {
    return this.belongsTo('App/Models/User', '_id', 'userId')
  }

  images () {
    return this.morphMany('App/Models/Image', 'imageableType', 'imageableId')
  }

}

module.exports = Venue
