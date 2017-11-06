'use strict'
const InvalidArgumentException = require('@adonisjs/generic-exceptions').InvalidArgumentException
const BadRequestException = use('App/Exceptions/BadRequestException')
const ResourceNotFoundException = use('App/Exceptions/ResourceNotFoundException')

class Instance {
  async handle (ctx, next, modelName) {
    if (!modelName) {
      throw InvalidArgumentException.invoke(`${modelName} not found!`)
    }
    const id = ctx.params.id
    if (!id) {
      throw InvalidArgumentException.invoke('Instance require :id parameter on router')
    }
    if (!/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(id)) {
      throw BadRequestException.invoke('id is invalid')
    }
    const Model = use(modelName)
    const instance = await Model.find(id)
    if (!instance) {
      throw ResourceNotFoundException.invoke(`Can not find model with id "${id}"`)
    }
    ctx.instance = instance
    // await next to pass the request to next middleware or controller
    await next()
  }
}

module.exports = Instance
