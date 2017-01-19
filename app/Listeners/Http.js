'use strict'

const Env = use('Env')
const Ouch = use('youch')
const Http = exports = module.exports = {}
const _ = use('lodash')

/**
 * handle errors occured during a Http request.
 *
 * @param  {Object} error
 * @param  {Object} request
 * @param  {Object} response
 */
Http.handleError = function* (error, request, response) {
  /**
   * Api response
   */
  if (request.url().indexOf('/api/') === 0) {
    const statusCodes = {
      ResourceNotFoundException: 404,
      ValidateErrorException: 422,
      PasswordMisMatchException: 401,
      UserNotFoundException: 404,
    }
    const status = statusCodes[error.name] || error.status || 500
    console.error(error.stack)
    let responseObject = {
      status_code: status,
      message: error.message,
      data: [],
    }
    if (error.name === 'ValidateErrorException') {
      responseObject.errors = error.message
      responseObject.message = _.map(error.message, 'message').join("\n")
    }

    if (Env.get('NODE_ENV') === 'development') {
      responseObject.traces = error.stack.split("\n")
    }

    return response.status(status).json(responseObject)
  }

  /**
   * DEVELOPMENT REPORTER
   */
  if (Env.get('NODE_ENV') === 'development') {
    const ouch = new Ouch().pushHandler(
      new Ouch.handlers.PrettyPageHandler('blue', null, 'sublime')
    )
    ouch.handleException(error, request.request, response.response, (output) => {
      console.error(error.stack)
    })
    return
  }

  /**
   * PRODUCTION REPORTER
   */
  const status = error.status || 500
  console.error(error.stack)
  yield response.status(status).sendView('errors/index', { error })
}

/**
 * listener for Http.start event, emitted after
 * starting http server.
 */
Http.onStart = function () {
  const Response = use('Adonis/Src/Response')

  Response.macro('apiCreated', function (item, meta) {
    console.log(item);
    this.status(201).json({
      status_code: 201,
      message: 'Created successfully',
      data: [item],
      meta: meta
    })
  })

  Response.macro('apiUpdated', function (item, meta) {
    this.status(202).json({
      status_code: 202,
      message: 'Updated successfully',
      data: [item],
      meta: meta
    })
  })

  Response.macro('apiDeleted', function (item, meta) {
    this.status(202).json({
      status_code: 202,
      message: 'Deleted successfully',
      data: [],
      meta: meta
    })
  })

  Response.macro('apiItem', function (item, meta) {
    this.status(200).json({
      status_code: 200,
      message: 'Data retrieval successfully',
      data: [item],
      meta: meta
    })
  })

  Response.macro('apiCollection', function (items, meta) {
    this.status(200).json({
      status_code: 200,
      message: 'Data retrieval successfully',
      data: [items],
      meta: meta
    })
  })

  Response.macro('apiSuccess', function (data, meta, message) {
    this.status(200).json({
      status_code: 200,
      message: message || 'Success',
      data,
      meta
    })
  })
}
