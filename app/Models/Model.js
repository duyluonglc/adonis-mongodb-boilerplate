'use_strict'
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

  toJson() {
    return _.omit(this.attributes, this.constructor.hidden)
  }
}

module.exports = Model
