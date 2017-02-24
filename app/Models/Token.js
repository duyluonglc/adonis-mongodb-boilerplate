'use strict'

const Model = use('LucidMongo')

class Token extends Model {

  user () {
    return this.belongsTo('App/Models/User', '_id', 'userId')
  }

}

module.exports = Token
