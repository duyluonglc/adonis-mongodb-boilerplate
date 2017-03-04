'use strict'

/*
|--------------------------------------------------------------------------
| Test Bootstrap
|--------------------------------------------------------------------------
| Bootstrap file to setup adonisjs providers before running the test.
|
*/

const app = require('../bootstrap/app')
const fold = require('adonis-fold')
const path = require('path')
const packageFile = path.join(__dirname, '../package.json')
require('../bootstrap/extend')

module.exports = function (callback) {
  fold.Registrar
    .register(app.providers.concat(app.aceProviders))
    .then(() => {
      /*
      |--------------------------------------------------------------------------
      | Register Aliases
      |--------------------------------------------------------------------------
      |
      | After registering all the providers, we need to setup aliases so that
      | providers can be referenced with short sweet names.
      |
      */
      fold.Ioc.aliases(app.aliases)

      /*
      |--------------------------------------------------------------------------
      | Register Package File
      |--------------------------------------------------------------------------
      |
      | Adonis application package.json file has the reference to the autoload
      | directory. Here we register the package file with the Helpers provider
      | to setup autoloading.
      |
      */
      const Helpers = use('Helpers')
      Helpers.load(packageFile, fold.Ioc)

      /*
      |--------------------------------------------------------------------------
      | Register Events
      |--------------------------------------------------------------------------
      |
      | Here we require the event.js file to register events defined inside
      | events.js file.
      |
      */
      require('../bootstrap/events')
      require('../database/factory')

      /*
      |--------------------------------------------------------------------------
      | Load Middleware And Routes
      |--------------------------------------------------------------------------
      |
      | Middleware and Routes are required to oil up your HTTP server. Here we
      | require defined files for same.
      |
      */
      use(Helpers.makeNameSpace('Http', 'kernel'))
      use(Helpers.makeNameSpace('Http', 'routes'))

      /*
      |--------------------------------------------------------------------------
      | Start Http Server
      |--------------------------------------------------------------------------
      |
      | We are all set to fire the Http Server and start receiving new requests.
      |
      */
      const Server = use('Adonis/Src/Server')
      callback(Server)

      /*
      |--------------------------------------------------------------------------
      | Firing Start Event
      |--------------------------------------------------------------------------
      */
      const Event = use('Event')
      Event.fire('Http.start')
    })
    .catch((error) => console.error(error.stack))
}

