'use strict'

const Model = use('LucidMongo')

/**
 * @swagger
 * definitions:
 *   NewImage:
 *     type: object
 *     properties:
 *       filename:
 *         type: string
 *   Image:
 *     allOf:
 *       - $ref: '#/definitions/NewImage'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 */
class Image extends Model {

  static get createTimestamp () { return 'createdAt' }

  static get updateTimestamp () { return 'updatedAt' }

  static get deleteTimestamp () { return 'deletedAt' }

  static get rules () {
    return {
      filename: 'required'
    }
  }

  static boot () {
    super.boot()
    this.addHook('afterDelete', 'App/Models/Hooks/Image.removeFile')
  }

}

module.exports = Image
