'use strict'
const _ = require('lodash')
const { InvalidArgumentException } = require('@adonisjs/generic-exceptions')

class DecodeQuery {
  async handle (ctx, next) {
    ctx.decodeQuery = () => {
      let query = {}
      if (ctx.request.input('query')) {
        try {
          query = JSON.parse(ctx.request.input('query'))
        } catch (error) {
          throw InvalidArgumentException.invoke(error.message)
        }
      }
      query.where = query.where || {}
      // let includes = query.with || []
      // query.with = includes
      return _.pick(query, ['select', 'skip', 'limit', 'where', 'sort', 'with'])
    }
    // await next to pass the request to next middleware or controller
    await next()
  }
}

module.exports = DecodeQuery
