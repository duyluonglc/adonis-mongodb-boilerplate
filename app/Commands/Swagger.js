'use strict'

const { Command } = require('@adonisjs/ace')
const Helpers = use('Helpers')
const fs = require('fs')

class Swagger extends Command {
  static get signature () {
    return 'swagger:update'
  }

  static get description () {
    return 'Copy swagger files from node_modules to public folder'
  }

  async handle (args, options) {
    const swaggerPath = Helpers.publicPath('plugins/swagger')
    const nodeModulesPath = Helpers.publicPath('../node_modules/swagger-ui-dist')
    fs.createReadStream(`${nodeModulesPath}/swagger-ui.css`).pipe(fs.createWriteStream(`${swaggerPath}/swagger-ui.css`))
    fs.createReadStream(`${nodeModulesPath}/swagger-ui-bundle.js`).pipe(fs.createWriteStream(`${swaggerPath}/swagger-ui-bundle.js`))
    fs.createReadStream(`${nodeModulesPath}/swagger-ui-standalone-preset.js`).pipe(fs.createWriteStream(`${swaggerPath}/swagger-ui-standalone-preset.js`))
    this.info(`Swagger files copied to: ${swaggerPath}`)
  }
}

module.exports = Swagger
