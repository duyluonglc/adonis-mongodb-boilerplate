'use strict'
const _ = require('lodash')
const Config = use('Config')
const { InvalidArgumentException } = require('@adonisjs/generic-exceptions')

class DecodeQuery {
  async handle (ctx, next, [modelName]) {
    ctx.decodeQuery = () => {
      let query = {}
      if (this.input('query')) {
        try {
          query = JSON.parse(this.input('query'))
        } catch (error) {
          throw InvalidArgumentException.invoke(error.message)
        }
      }
      query.limit = query.limit || Config.get('api.limit', 20)
      query.skip = query.skip || 0
      query.where = query.where || {}
      let includes = query.with || []
      if (_.isString(includes)) {
        includes = [{
          relation: includes
        }]
      } else if (_.isArray(includes)) {
        includes = includes.map(include => {
          if (_.isString(include)) {
            return {
              relation: include
            }
          } else if (_.isObject(include)) {
            if (!include.relation) {
              throw InvalidArgumentException.invoke('`with` require relation property')
            }
            return include
          } else {
            throw InvalidArgumentException.invoke('`with` is not valid format')
          }
        })
      } else if (_.isObject(includes)) {
        if (!includes.relation) {
          throw InvalidArgumentException.invoke('`with` require relation property')
        }
      } else {
        throw InvalidArgumentException.invoke('`with` is not valid format')
      }
      query.with = includes
      return _.pick(query, ['select', 'skip', 'limit', 'where', 'sort', 'limit', 'with'])
    }
    // await next to pass the request to next middleware or controller
    await next()
  }
}

module.exports = DecodeQuery
