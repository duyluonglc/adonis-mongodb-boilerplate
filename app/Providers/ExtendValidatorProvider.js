'use strict'

const { ServiceProvider } = require('@adonisjs/fold')

class ExtendValidatorProvider extends ServiceProvider {
  async existValidator (data, field, message, args, get) {
    const InvalidArgumentException = use('App/Exceptions/InvalidArgumentException')
    const Database = use('Database')
    /**
     * skip if value is empty, required validation will
     * take care of empty values
     */
    const fieldValue = get(data, field)
    if (!fieldValue) {
      return true
    }
    const collectionName = args[0]
    const databaseField = args[1] || field
    if (!collectionName) {
      throw new InvalidArgumentException('Unique rule require collection name')
    }
    const database = Database.collection(collectionName)
    database.where(databaseField).eq(fieldValue)
    /**
     * if args[2] and args[3] are available inside the array
     * take them as whereNot key/value pair to limit scope
     */
    if (args[2] && args[3]) {
      database.where(args[2]).eq(args[3])
    }

    const exists = await database.findOne()
    if (!exists) {
      throw message
    }
  }

  async digitValidator (data, field, message, args, get) {
    const fieldValue = get(data, field)
    if (!fieldValue) {
      return true
    }
    if (!/^\d+/i.test(fieldValue)) {
      throw message
    }
  }

  async numericValidator (data, field, message, args, get) {
    let fieldValue = get(data, field)
    if (!fieldValue) {
      return true
    }
    if (isNaN(fieldValue)) {
      throw message
    }
  }

  async lengthValidator (data, field, message, args, get) {
    const fieldValue = get(data, field)
    if (!fieldValue) {
      return true
    }
    if (fieldValue.length !== parseInt(args[0])) {
      throw message
    }
  }

  async objectIdValidator (data, field, message, args, get) {
    const fieldValue = get(data, field)
    if (!fieldValue) {
      return true
    }
    if (!/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(fieldValue)) {
      throw message
    }
  }

  async minValueValidator (data, field, message, args, get) {
    const fieldValue = get(data, field)
    if (fieldValue < args[0]) {
      throw message
    }
  }

  async maxValueValidator (data, field, message, args, get) {
    const fieldValue = get(data, field)
    if (fieldValue > args[0]) {
      throw message
    }
  }

  async boot () {
    // register bindings
    const Validator = use('Adonis/Addons/Validator')
    Validator.extend('exist', this.existValidator, '{{field}} is not exists')
    Validator.extend('objectId', this.objectIdValidator, '{{field}} is not valid ObjectID')
    Validator.extend('digit', this.digitValidator, '{{field}} is not valid digit')
    Validator.extend('numeric', this.numericValidator, '{{field}} is not valid numeric')
    Validator.extend('length', this.lengthValidator, '{{field}} is not valid length')
    Validator.extend('minValue', this.minValueValidator, '{{field}} is not valid minValue')
    Validator.extend('maxValue', this.maxValueValidator, '{{field}} is not valid maxValue')
  }
}

module.exports = ExtendValidatorProvider
