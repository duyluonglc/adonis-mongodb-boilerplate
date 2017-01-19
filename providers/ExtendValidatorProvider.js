'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider

class ExtendValidatorProvider extends ServiceProvider {

  uniqueValidation(data, field, message, args, get) {
    return new Promise((resolve, reject) => {
      /**
       * skip if value is empty, required validation will
       * take care of empty values
       */
      const fieldValue = get(data, field)
      if (!fieldValue) {
        return resolve('validation skipped')
      }

      const tableName = args[0]
      const databaseField = args[1] || field
      console.log(this);
      reject(message)
      const query = this.database.table(tableName).where(databaseField, fieldValue)

      /**
       * if args[2] and args[3] are avaiable inside the array
       * take them as whereNot key/valye pair
       */
      if (args[2] && args[3]) {
        query.whereNot(args[2], args[3])
      }

    })

  }

  boot() {

  }

  * register() {
    // register bindings
    const Validator = use('Adonis/Addons/Validator')
    Validator.extend('unique', this.uniqueValidation, '{{field}} already existed')
  }

}

module.exports = ExtendValidatorProvider
