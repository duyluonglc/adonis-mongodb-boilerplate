'use_strict'
const LucidMongo = use('LucidMongo')

class Model extends LucidMongo {

  static get createTimestamp () { return 'created_at' }

  static get updateTimestamp () { return 'updated_at' }

  static get deleteTimestamp () { return 'deleted_at' }

}

module.exports = Model
