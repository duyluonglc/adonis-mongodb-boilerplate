'use strict'

const Model = use('Model')

class Token extends Model {
  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Token
