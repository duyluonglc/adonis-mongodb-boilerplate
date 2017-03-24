'use strict'

const Env = use('Env')
const Youch = use('youch')
const _ = use('lodash')
const Exceptions = use('node-exceptions')
const Http = exports = module.exports = {}
const Config = use('Config')

/**
 * handle errors occured during a Http request.
 *
 * @param  {Object} error
 * @param  {Object} request
 * @param  {Object} response
 */
Http.handleError = function * (error, request, response) {
  const statusCodes = {
    BadRequestException: 400,
    ResourceNotFoundException: 404,
    ValidateErrorException: 422,
    PasswordMisMatchException: 401,
    LoginFailedException: 401,
    AccountNotVerifiedException: 401,
    UserNotFoundException: 404,
    UnAuthorizeException: 403
  }
  const status = statusCodes[error.name] || error.status || 500
  if (!statusCodes[error.name]) {
    console.log(error.stack)
  }
  /**
   * Api response
   */
  if (request.url().indexOf('/api/') === 0) {
    let responseObject = {
      statusCode: status,
      name: error.name,
      message: error.message
    }
    if (_.isArray(error.message)) {
      responseObject.errors = error.message
      responseObject.message = _.map(error.message, 'message').join('\n')
    }

    if (Env.get('NODE_ENV') === 'development') {
      responseObject.traces = error.stack.split('\n')
    }
    return response.status(status).json(responseObject)
  }

  /**
   * DEVELOPMENT REPORTER
   */
  if (Env.get('NODE_ENV') === 'development') {
    const youch = new Youch(error, request.request)
    const type = request.accepts('json', 'html')
    const formatMethod = type === 'json' ? 'toJSON' : 'toHTML'
    const formattedErrors = yield youch[formatMethod]()
    response.status(status).send(formattedErrors)
    return
  }

  /**
   * PRODUCTION REPORTER
   */
  // console.error(error.stack)
  if (error.name === 'ValidateErrorException') {
    request.withAll().andWith({
      errors: error.message
    }).flash()
    return response.redirect('back')
  }
  yield response.status(status).sendView('errors/index', {error})
}

/**
 * listener for Http.start event, emitted after
 * starting http server.
 */
Http.onStart = function () {
  registerResponseMacros()
  registerRequestMacros()

  const View = use('View')
  View.global('url', function (path) {
    return `${Config.get('app.baseUrl')}${path || ''}`
  })
}

function registerResponseMacros () {
  const Response = use('Adonis/Src/Response')

  Response.macro('apiCreated', function (item, meta) {
    this.status(201).json({
      statusCode: 201,
      message: 'Created successfully',
      data: item,
      meta: meta
    })
  })

  Response.macro('apiUpdated', function (item, meta) {
    this.status(202).json({
      statusCode: 202,
      message: 'Updated successfully',
      data: item,
      meta: meta
    })
  })

  Response.macro('apiDeleted', function (item, meta) {
    this.status(202).json({
      statusCode: 202,
      message: 'Deleted successfully',
      data: null,
      meta: meta
    })
  })

  Response.macro('apiItem', function (item, meta) {
    this.status(200).json({
      statusCode: 200,
      message: 'Data retrieval successfully',
      data: item,
      meta: meta
    })
  })

  Response.macro('apiCollection', function (items, meta) {
    this.status(200).json({
      statusCode: 200,
      message: 'Data retrieval successfully',
      data: items,
      meta: meta
    })
  })

  Response.macro('apiSuccess', function (data, meta, message) {
    this.status(200).json({
      statusCode: 200,
      message: message || 'Success',
      data: data,
      meta: meta
    })
  })
}

function registerRequestMacros () {
  const Request = use('Adonis/Src/Request')
  const objectId = use('mongodb').ObjectID
  const moment = use('moment')

  Request.macro('getQuery', function () {
    let query = {}
    if (this.input('query')) {
      try {
        query = JSON.parse(this.input('query'))
      } catch (error) {
        throw new Exceptions.InvalidArgumentException(error.message)
      }
      }
    function convertType (obj) {
      for (let key in obj) {
        let element = obj[key]
        if (_.isObject(element)) {
          obj[key] = convertType(element)
        } else if (_.isString(element)) {
          if (/^objectId:(.*)/.test(element)) {
            obj[key] = objectId(element.match(/^objectId:(.*)/)[1])
          } else if (/^date:(.*)/.test(element)) {
            obj[key] = moment(element.match(/^date:(.*)/)[1]).toDate()
    }
        }
      }

      return obj
    }
    query = convertType(query)
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
            throw new Exceptions.InvalidArgumentException('`with` require relation property')
          }
          return include
        } else {
          throw new Exceptions.InvalidArgumentException('`with` is not valid format')
        }
      })
    } else if (_.isObject(includes)) {
      if (!includes.relation) {
        throw new Exceptions.InvalidArgumentException('`with` require relation property')
      }
    } else {
      throw new Exceptions.InvalidArgumentException('`with` is not valid format')
    }
    query.with = includes
    return _.pick(query, ['select', 'skip', 'limit', 'where', 'sort', 'limit', 'with'])
  })
}
