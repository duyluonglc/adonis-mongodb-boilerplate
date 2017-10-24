'use strict'
const InvalidArgumentException = use('App/Exceptions/InvalidArgumentException')
const ResourceNotFoundException = use('App/Exceptions/ResourceNotFoundException')

class Instance {
  async handle (request, response, next, modelName) {
    if (!modelName) {
      throw new InvalidArgumentException('Instance middleware need modelName parameter')
    }
    const id = request.param('id')
    if (!id) {
      throw new InvalidArgumentException('Instance middleware need :id parameter in router')
    }
    if (!/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(id)) {
      throw new InvalidArgumentException('id is invalid')
    }
    const Model = use(modelName)
    const instance = await Model.find(id)
    if (!instance) {
      throw new ResourceNotFoundException(`Can not find model with id "${id}"`)
    }
    request.instance = instance
    // await next to pass the request to next middleware or controller
    await next
  }
}

module.exports = Instance
