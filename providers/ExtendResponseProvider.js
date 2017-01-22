'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider

class ExtendResponseProvider extends ServiceProvider {

  // transform(data) {
  //   const Model = use('App/Models/Model')
  //   if (_.isArray(data)) {
  //     return data.map(item => {
  //       if (item instanceof Model) {
  //         return item.toJson()
  //       } else {
  //         return item
  //       }
  //     })
  //   } else {
  //     if (data instanceof Model) {
  //       return data.toJson()
  //     } else {
  //       return data
  //     }
  //   }
  // }

  * boot() {
    // const Config = this.app.use('Config')
    const Response = this.app.use('Adonis/Src/Response')

  }

  * register() {

    // Response.macro('apiCreated', function (item, meta) {
    //   this.status(201).json({
    //     status_code: 201,
    //     message: 'Created successfully',
    //     data: this.transform(item),
    //     meta: meta
    //   })
    // })

    // Response.macro('apiUpdated', function (item, meta) {
    //   this.status(202).json({
    //     status_code: 202,
    //     message: 'Updated successfully',
    //     data: this.transform(item),
    //     meta: meta
    //   })
    // })

    // Response.macro('apiDeleted', function (item, meta) {
    //   this.status(202).json({
    //     status_code: 202,
    //     message: 'Deleted successfully',
    //     data: null,
    //     meta: meta
    //   })
    // })

    // Response.macro('apiItem', function (item, meta) {
    //   this.status(200).json({
    //     status_code: 200,
    //     message: 'Data retrieval successfully',
    //     data: this.transform(item),
    //     meta: meta
    //   })
    // })

    // Response.macro('apiCollection', function (items, meta) {
    //   this.status(200).json({
    //     status_code: 200,
    //     message: 'Data retrieval successfully',
    //     data: this.transform(items),
    //     meta: meta
    //   })
    // })

    // Response.macro('apiSuccess', function (data, meta, message) {
    //   this.status(200).json({
    //     status_code: 200,
    //     message: message || 'Success',
    //     data: this.transform(data),
    //     meta
    //   })
    // })
  }

}

module.exports = ExtendResponseProvider
