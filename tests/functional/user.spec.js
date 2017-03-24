'use strict'

const chai = require('chai')
const request = require('supertest')
const assert = chai.assert
const baseUrl = `http://${process.env.HOST}:${process.env.PORT}/`
require('co-mocha')
const User = use('App/Models/User')
const Image = use('App/Models/Image')
const Factory = use('Factory')
let user = null

describe('Get user', function () {
  beforeEach(function * () {
    user = yield User.create(Factory.model('App/Models/User').make().toJSON())
  })

  afterEach(function * () {
    yield User.query().remove()
  })

  it('should get user details', function * () {
    const response = yield request(baseUrl)
      .get(`api/users/${user._id}`)
      .expect('Content-Type', /json/)
      .expect(200)
    assert.equal(response.body.statusCode, 200)
    assert.equal(response.body.data._id, user._id)
  })
})

describe('Update User', function () {
  beforeEach(function * () {
    user = yield User.create(Factory.model('App/Models/User').make().toJSON())
  })

  afterEach(function * () {
    yield User.query().remove()
  })

  it('should throw validation error language is invalid', function * () {
    const response = yield request(baseUrl)
      .put(`api/users/${user._id}`)
      .login(user)
      .send({language: 'foo'})
      .expect(422)
    assert.equal(response.body.statusCode, 422)
  })

  it('should update user', function * () {
    const response = yield request(baseUrl)
      .put(`api/users/${user._id}`)
      .login(user)
      .send({language: 'vi', name: 'John'})
      .expect(202)
    assert.equal(response.body.statusCode, 202)
    assert.equal(response.body.data.name, 'John')
  })
})

describe('Delete user', function () {
  beforeEach(function * () {
    user = yield User.create(Factory.model('App/Models/User').make().toJSON())
  })

  afterEach(function * () {
    yield User.query().remove()
  })

  it('should delete user', function * () {
    const response = yield request(baseUrl)
      .delete(`api/users/${user._id}`)
      .login(user)
      .expect(202)
    assert.equal(response.body.statusCode, 202)
    const userTemp = yield User.find(user._id)
    assert.equal(userTemp, null)
  })
})

describe('Upload Image', function () {
  beforeEach(function * () {
    user = yield User.create(Factory.model('App/Models/User').make().toJSON())
  })

  afterEach(function * () {
    yield User.query().remove()
    yield Image.query().remove()
  })

  it('should throw validation error file is invalid', function * () {
    const response = yield request(baseUrl)
      .post(`api/users/${user._id}/upload`)
      .login(user)
      .send({})
      .expect(422)
    assert.equal(response.body.statusCode, 422)
  })

  it('should upload user avatar', function * () {
    const response = yield request(baseUrl)
      .post(`api/users/${user._id}/upload`)
      .login(user)
      .field('isAvatar', 1)
      .attach('image', 'tests/fixtures/demo.png')
      .expect(202)
    assert.equal(response.body.statusCode, 202)
    const userTemp = yield User.find(user._id)
    assert.notEqual(userTemp.avatar, null)
    const image = yield Image.find(userTemp.avatar._id)
    yield image.delete()
  })
})
