'use strict'

// const User = use('App/Models/User')
const Ioc = require('adonis-fold').Ioc

class FingerPrint {

  constructor(request, serializer, options) {
    this.request = request
    this.serializer = serializer
    this.options = options // config options
  }

  * check() {
    const params = request.params()
    console.log(params);
    return false
  }

  * getUser() {
    return this.user
  }

}

module.exports = FingerPrint
