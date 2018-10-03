'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/**
 * @swagger
 * components:
 *   NewImage:
 *     type: object
 *     properties:
 *       filename:
 *         type: string
 *   Image:
 *     allOf:
 *       - $ref: '#/components/NewImage'
 *       - type: object
 *         properties:
 *           _id:
 *             type: string
 */
class Image extends Model {
  static get createTimestamp () { return 'createdAt' }
  static get updateTimestamp () { return 'updatedAt' }

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
