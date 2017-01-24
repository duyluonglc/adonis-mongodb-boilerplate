'use strict'

class Acl {

  * handle (request, response, next, role) {
    // here goes your middleware logic
    // yield next to pass the request to next middleware or controller
    yield next
  }

}

module.exports = Acl
