'use strict'
const Exceptions = use('Exceptions')

class Instance {

  * handle (request, response, next, modelName) {
    if (!modelName) {
      throw new Exceptions.InvalidArgumentException('Instance middleware need modelName parameter')
    }
    const id = request.param('id')
    if (!id) {
      throw new Exceptions.InvalidArgumentException('Instance middleware need :id parameter in router')
    }
    if (!/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(id)) {
      throw new Exceptions.InvalidArgumentException('id is invalid')
    }
    const Model = use(modelName)
    const instance = yield Model.find(id)
    if (!instance) {
      throw new Exceptions.ResourceNotFoundException(`Can not find model with id "${id}"`)
    }
    request.instance = instance
    // yield next to pass the request to next middleware or controller
    yield next
  }

}

module.exports = Instance
