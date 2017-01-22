'use_strict'
require('harmony-reflect')
const mixin = require('es6-class-mixin')
const Serializer = require('./Mixins/Serializer')
const MongoritoModel = use('MongoritoModel')
const _ = use('lodash')

class Model extends MongoritoModel {
  // constructor() {
  //   super()
  //   if (this.constructor === Model) {
  //     throw new TypeError("Cannot construct Abstract instances directly");
  //   }
  // }
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

  // toJson() {
  //   let obj = _.omit(this.attributes, this.constructor.hidden)
  //   _.forEach(obj, (value, key) => {
  //     if (_.isObject(value) && _.isFunction(value.toJson))
  //       obj[key] = value.toJson()
  //     else if (_.isArray(value)) {
  //       _.forEach(value, (v, k) => {
  //         if (_.isObject(v) && _.isFunction(v.toJson)) {
  //           obj[key][k] = v.toJson()
  //         }
  //       })
  //     }
  //   })
  //   return obj
  // }
}

class ExtendedModel extends mixin(
  Model,
  Serializer
) { }

module.exports = ExtendedModel
