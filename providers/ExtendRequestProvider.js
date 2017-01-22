'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider

class ExtendRequestProvider extends ServiceProvider {

  * boot() {
    const Request = use('Adonis/Src/Request')
    Request.macro('cartValue', function () {
      return this.cookie('cartValue', 0)
    })

  }

  * register() {

  }

}

module.exports = ExtendRequestProvider
