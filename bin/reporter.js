'use strict'

/*
|--------------------------------------------------------------------------
| Custom Mocha Reporter
|--------------------------------------------------------------------------
| A Custom reporter for showing tests on the console.
*/

const Mocha = require('mocha')
const ms = require('ms')
const colors = require('colors')

class AdonisReporter extends Mocha.reporters.base {

  constructor (runner) {
    super(runner)
    this.passesCount = 0
    this.failuresCount = 0
    runner.on('pass', this.onPass.bind(this))
    runner.on('fail', this.onFail.bind(this))
    runner.on('suite', this.onSuite.bind(this))
    runner.on('end', this.epilogue.bind(this))
    runner.on('pending', this.onPending.bind(this))
  }

  /**
   * when tests passes
   *
   * @param      {Object}  test
   */
  onPass (test) {
    this.passesCount++
    console.log(`${colors.green('pass')}: %s %s`, test.title, this.getTestDuration(test.duration, test.slow()))
  }

  /**
   * when tests fails
   *
   * @param      {Object}  test    The test
   * @param      {Object}  err     The error
   */
  onFail (test, err) {
    this.failuresCount++
    console.log(`${colors.red('fail')}: %s -- error: %s %s`, test.title, err.message, this.getTestDuration(test.duration, test.slow()))
  }

  /**
   * when a new test suite is started
   *
   * @param      {Object}  suite   The suite
   */
  onSuite (suite) {
    console.log(`\n${colors.white(suite.title)}`)
  }

  /**
   * when test is pending
   *
   * @param      {Object}  test    The test
   */
  onPending (test) {
    console.log(`${colors.cyan('pending')}: %s`, test.title)
  }

  /**
   * returns formatted colored duration for a given test
   *
   * @param      {number}   duration          The duration
   * @param      {number}   expectedDuration  The expected duration
   * @return     {String}  The test duration.
   */
  getTestDuration (duration, expectedDuration) {
    return duration > expectedDuration ? colors.red(ms(duration)) : colors.yellow(ms(duration))
  }

}

module.exports = AdonisReporter
