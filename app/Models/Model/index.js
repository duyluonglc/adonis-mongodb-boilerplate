'use_strict'
require('harmony-reflect')
const mixin = require('es6-class-mixin')
const Serializer = require('./Mixins/Serializer')
const MongoritoModel = use('MongoritoModel')
const Exceptions = use('Exceptions')
const _ = use('lodash')

class Model extends MongoritoModel {

  get id() { return this.get('_id') }

  static get primaryKey() { return 'id' }

  static get createTimestamp() { return 'created_at' }

  static get updateTimestamp() { return 'updated_at' }

  static get deleteTimestamp() { return 'deleted_at' }

  static get hidden() { return [] }

  static get visible() { return [] }

  get related() {
    return []
  }

  static * findOrFail(where) {
    const instance = yield this.findOne(where)
    if (!instance) {
      throw new Exceptions.ResourceNotFoundException('Can not find instance')
    }
    return instance
  }

}

class ExtendedModel extends mixin(
  Model,
  Serializer
) { }

module.exports = ExtendedModel
