'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider
const co = require('co')
const _ = require('lodash')
const qs = require('qs')

class ExtendValidatorProvider extends ServiceProvider {

  uniqueValidator (data, field, message, args, get) {
    const LucidMongo = use('LucidMongo')
    const Exceptions = use('Exceptions')
    return new Promise((resolve, reject) => {
      /**
       * skip if value is empty, required validation will
       * take care of empty values
       */
      const fieldValue = get(data, field)
      if (!fieldValue) {
        return resolve('validation skipped')
      }
      const collectionName = args[0]
      const databaseField = args[1] || field
      if (!collectionName) {
        throw new Exceptions.RunTimeException('Unique rule require collection name')
      }

      co(function * () {
        let query = LucidMongo.query()
        const connection = yield query.connect()
        query = query.queryBuilder.collection(connection.collection(collectionName))
        query = query.where(databaseField).eq(fieldValue)
        /**
         * if args[2] are available inside the array
         * take them as where to limit scope
         */
        if (args[2]) {
          query = query.where(qs.parse(args[2]))
        }

        const exists = yield query.findOne()
        return yield Promise.resolve(exists)
      }).then(function (exists) {
        if (exists) {
          reject(message)
        } else {
          resolve('valid')
        }
      }).catch(reject)
    })
  }

  existValidator (data, field, message, args, get) {
    const LucidMongo = use('LucidMongo')
    const Exceptions = use('Exceptions')
    return new Promise((resolve, reject) => {
      /**
       * skip if value is empty, required validation will
       * take care of empty values
       */
      const fieldValue = get(data, field)
      if (!fieldValue) {
        return resolve('validation skipped')
      }
      const collectionName = args[0]
      const databaseField = args[1] || field
      if (!collectionName) {
        throw new Exceptions.RunTimeException('Unique rule require collection name')
      }
      co(function * () {
        let query = LucidMongo.query()
        const connection = yield query.connect()
        query = query.queryBuilder.collection(connection.collection(collectionName))
        query = query.where(databaseField).eq(fieldValue)
        /**
         * if args[2] are available inside the array
         * take them as where to limit scope
         */
        if (args[2]) {
          query = query.where(qs.parse(args[2]))
        }

        const exists = yield query.findOne()
        return yield Promise.resolve(exists)
      }).then(function (exists) {
        if (exists) {
          reject(message)
        } else {
          resolve('valid')
        }
      }).catch(reject)
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
