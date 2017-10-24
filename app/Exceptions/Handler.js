'use strict'

const Env = use('Env')
const _ = require('lodash')
/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle (error, { request, response, view }) {
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
      console.log(error)
    }
    /**
     * Api response
     */
    if (request.url().indexOf('/api/') === 0) {
      let responseObject = {
        status_code: status,
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
      const formattedErrors = await youch[formatMethod]()
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

    return view.render('errors/index', { error })
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report (error, { request }) {
    error.status === 500 && console.log(error)
  }
}

module.exports = ExceptionHandler
