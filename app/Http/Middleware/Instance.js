'use strict'
const Exceptions = use('Exceptions')

class Instance {

  * handle(request, response, next, modelName) {
    if(!modelName) {
      throw new Exceptions.RuntimeError('Instance middleware need modelName parameter')
    }
    const Model = use(`App/Models/${modelName}`)
    const id = request.param('id')
    const instance = yield Model.findById(id)
    if (!instance) {
      throw new Exceptions.ResourceNotFoundException(`Can not find model with id "${id}"`)
    }
    request.instance = instance
    // yield next to pass the request to next middleware or controller
    yield next
  }

}

module.exports = Instance
