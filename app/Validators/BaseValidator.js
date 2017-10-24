
class BaseValidator {
  async fails (errorMessages) {
    const { request, response } = this.ctx
    if (request.url().indexOf('/api/') === 0) {
      return response.status(400).json({
        status_code: 400,
        name: 'ValidateErrorException',
        message: 'Validation failed',
        errors: errorMessages
      })
    }

    request.withAll().andWith({
      errors: errorMessages
    }).flash()
    return response.redirect('back')
  }
}

module.exports = BaseValidator
