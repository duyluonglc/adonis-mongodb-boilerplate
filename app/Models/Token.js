'use strict'

const Model = use('App/Models/Model')

class Token extends Model {

  user () {
    return this.belongsTo('App/Models/User')
  }

}

module.exports = Token
