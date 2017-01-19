'use strict'

const Schema = use('Schema')

class TokensTableSchema extends Schema {

  up () {
    this.create('tokens', table => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('token', 40).notNullable().unique()
      table.boolean('forever').defaultTo(false)
      table.boolean('is_revoked').defaultTo(false)
      table.timestamp('expiry')
      table.timestamps()
    })
  }

  down () {
    this.drop('tokens')
  }

}

module.exports = TokensTableSchema
