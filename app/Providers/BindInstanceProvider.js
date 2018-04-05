'use strict'

const { ioc, ServiceProvider } = require('@adonisjs/fold')

class BindInstanceProvider extends ServiceProvider {
  async bindMiddleware (ctx, next, [modelName, identifier = 'id']) {
    const InvalidArgumentException = require('@adonisjs/generic-exceptions').InvalidArgumentException
    const BadRequestException = ioc.use('App/Exceptions/BadRequestException')
    const ResourceNotFoundException = ioc.use('App/Exceptions/ResourceNotFoundException')

    if (!modelName) {
      throw InvalidArgumentException.invoke(`${modelName} not found!`)
    }
    const id = ctx.params[identifier]
    if (!id) {
      throw InvalidArgumentException.invoke('Instance require :id parameter on router')
    }
    if (!/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(id)) {
      throw BadRequestException.invoke('id is invalid')
    }
    const Model = ioc.use(modelName)
    const instance = await Model.find(id)
    if (!instance) {
      throw ResourceNotFoundException.invoke(`Can not find model with id "${id}"`)
    }
    ctx.instance = instance
    // await next to pass the request to next middleware or controller
    await next()
  }

  register () {
    const Route = ioc.use('Route')
    const Server = ioc.use('Server')

    Server.registerNamed({ instance: this.bindMiddleware })

    Route.Route.macro('instance', function (model, identifier = 'id') {
      this.middleware(`instance:${model},${identifier}`)
      return this
    })
  }
}

module.exports = BindInstanceProvider
