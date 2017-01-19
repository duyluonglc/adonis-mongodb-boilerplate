
const NE = require('node-exceptions')

class ResourceNotFoundException extends NE.RuntimeException { }

class ValidateErrorException extends NE.RuntimeException { }

module.exports = {
  ResourceNotFoundException,
  ValidateErrorException,
}
