'use strict'

/*
|--------------------------------------------------------------------------
| Test runner for the project
|--------------------------------------------------------------------------
|
| Since, adonis is a tightly coupled framework, we need to setup the project
| before running any tests and this can be done using the Mocha API.
|
*/

const Mocha = require('mocha')
const mocha = new Mocha({reporter: require('./reporter')})

/**
 * sets up mocha by adding test files to it.
 *
 * @param      {Array}    files       The files
 * @param      {Function}  callback    The callback
 * @param      {Boolean}    fireServer  The fire server
 * @param      {Object}    Server      The server
 *
 * @public
 */
module.exports = function (files, callback, fireServer, Server) {
  files.forEach(mocha.addFile.bind(mocha))
  require('../tests/before-tests')
  callback(mocha, fireServer, Server)
}
