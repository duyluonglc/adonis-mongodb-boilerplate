'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider
const LucidMongo = use('adonis-lucid-mongodb/src/LucidMongo/Model')
const Exceptions = use('node-exceptions')

class ExtendValidatorProvider extends ServiceProvider {

  uniqueValidator (data, field, message, args, get) {
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
      if (!tableName) {
        throw new Exceptions.RunTimeException('Unique rule require table name')
      }

      let where = {}
      where[databaseField] = fieldValue

      /**
       * if args[2] and args[3] are available inside the array
       * take them as whereNot key/value pair to ignore
       */
      if (args[2] && args[3]) {
        where[args[2]] = { neq: args[3]}
      }

      /**
       * if args[4] and args[5] are available inside the array
       * take them as where key/value pair to limit scope
       */
      if (args[4] && args[5]) {
        where[args[4]] = args[5]
      }

      class Model extends LucidMongo {
        static get table () { return tableName }
      }
      Model.findBy(where).then(exists => {
        if (exists)
          reject(message)
        else
          resolve('valid')
      })
    })
  }

  existValidator (data, field, message, args, get) {
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
      if (!tableName) {
        throw new Exceptions.RunTimeException('Unique rule require table name')
      }

      let where = {}
      where[databaseField] = fieldValue

      /**
       * if args[2] and args[3] are available inside the array
       * take them as where key/value pair to limit scope
       */
      if (args[2] && args[3]) {
        where[args[2]] = args[3]
      }

      class Model extends LucidMongo {
        static get table () { return tableName }
      }

      Model.findBy(where).then(exists => {
        if (exists)
          resolve('valid')
        else
          reject(message)
      })
    })
  }

  * boot () {
    // register bindings
    const Validator = use('Adonis/Addons/Validator')
    Validator.extend('unique', this.uniqueValidator, '{{field}} already exists')
    Validator.extend('exist', this.existValidator, '{{field}} is not exists')
  }

}

module.exports = ExtendValidatorProvider
