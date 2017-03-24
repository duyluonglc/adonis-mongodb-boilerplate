'use strict'

const chai = require('chai')
const request = require('supertest')
const assert = chai.assert
const baseUrl = `http://${process.env.HOST}:${process.env.PORT}/`
require('co-mocha')

describe('Get swagger spec', function () {
  it('should response json of swagger spec', function * () {
    const response = yield request(baseUrl)
      .get(`api-docs.json`)
      .expect('Content-Type', /json/)
      .expect(200)
    assert.isObject(response.body.paths)
  })
})

describe('Get swagger ui', function () {
  it('should response swagger ui page', function * () {
    yield request(baseUrl)
      .get(`docs`)
      .expect('Content-Type', /html/)
      .expect(200)
  })
})
