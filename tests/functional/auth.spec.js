'use strict'

const chai = require('chai')
const request = require('supertest')
const assert = chai.assert
const baseUrl = `http://${process.env.HOST}:${process.env.PORT}/`
require('co-mocha')
const User = use('App/Models/User')
let user = null

describe('Account Register', function () {
  beforeEach(function * () {})

  afterEach(function * () {
    yield User.query().remove()
  })

  it('should throw validation error when user email is missing', function * () {
    const response = yield request(baseUrl)
      .post('api/auth/register')
      .expect('Content-Type', /json/)
      .expect(422)
    assert.equal(response.body.statusCode, 422)
  // assert.equal(response.body.message, 'Validation failed')
  // assert.deepEqual(response.body.fields, [{field: 'email', 'validation': 'required', message: 'Enter email address to be used for login'}])
  })

  it('should throw validation error when user name is missing', function * () {
    const response = yield request(baseUrl)
      .post('api/auth/register')
      .send({email: 'newuser@adonisjs.com', password: 'secret'})
      .expect('Content-Type', /json/)
      .expect(422)

    assert.equal(response.body.statusCode, 422)
  })

  it('should throw validation error when user email is invalid', function * () {
    const response = yield request(baseUrl)
      .post('api/auth/register')
      .send({email: 'foo'})
      .expect('Content-Type', /json/)
      .expect(422)

    assert.equal(response.body.statusCode, 422)
  })

  it('should throw validation error when user password is missing', function * () {
    const response = yield request(baseUrl)
      .post('api/auth/register')
      .send({email: 'newuser@adonisjs.com'})
      .expect('Content-Type', /json/)
      .expect(422)
    assert.equal(response.body.statusCode, 422)
  })

  it('should throw validation error if language is invalid', function * () {
    const response = yield request(baseUrl)
      .post('api/auth/register')
      .send({name: 'test user', email: 'newuser@adonisjs.com', password: 'secret', language: 'xx'})
      .expect('Content-Type', /json/)
      .expect(422)
    assert.equal(response.body.statusCode, 422)
  })

  it('should throw validation error when user email address has already been taken', function * () {
    user = use('Factory').model('App/Models/User').make()
    yield user.save()
    const response = yield request(baseUrl)
      .post('api/auth/register')
      .send({email: user.email, password: 'secret', language: 'xx'})
      .expect('Content-Type', /json/)
      .expect(422)

    assert.equal(response.body.statusCode, 422)
  })

  it('should register a user and send registeration email', function * () {
    const response = yield request(baseUrl)
      .post('api/auth/register')
      .send({name: 'test user', email: 'newuser@adonisjs.com', password: 'secret', language: 'en'})
      .expect('Content-Type', /json/)
      .expect(201)
    assert.equal(response.body.statusCode, 201)
  })
})

describe('Account verification', function () {
  beforeEach(function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verificationToken = 'hash-verification-token'
    yield user.save()
  })

  afterEach(function * () {
    const User = use('App/Models/User')
    yield User.query().remove()
  })

  it('should throw error if token is invalid', function * () {
    const response = yield request(baseUrl)
      .get(`auth/verify?token=foo`)
      .expect(400)
  })

  it('should verify user and redirect to home page', function * () {
    const response = yield request(baseUrl)
      .get(`auth/verify?token=hash-verification-token`)
      .expect(302)
    const user = yield User.first()
    assert.equal(user.verified, true)
  })
})

describe('Auth login', function () {
  beforeEach(function * () {})

  afterEach(function * () {
    const User = use('App/Models/User')
    yield User.query().remove()
  })

  it('should throw 404 error when user email is not registerd', function * () {
    const response = yield request(baseUrl)
      .post(`api/auth/login`)
      .send({email: 'foo@email', password: 'test@password'})
      .expect(404)
  })

  it('should throw 401 error if password is invalid', function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verified = true
    yield user.save()
    const response = yield request(baseUrl)
      .post(`api/auth/login`)
      .send({email: user.email, password: 'foo@password'})
      .expect(401)
  })

  it('should throw 401 error when user email is not verified', function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verified = false
    yield user.save()
    const response = yield request(baseUrl)
      .post(`api/auth/login`)
      .send({email: user.email, password: user.password})
      .expect(401)
  })

  it('should generate jwt token if password is valid', function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verified = true
    yield user.save()
    const response = yield request(baseUrl)
      .post(`api/auth/login`)
      .send({email: user.email, password: user.password})
      .expect(200)
    assert.isNotNull(response.body.data.token)
    assert.equal(response.body.data.email, user.email)
  })
})

describe('Auth me', function () {
  beforeEach(function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verified = false
    yield user.save()
  })

  afterEach(function * () {
    const User = use('App/Models/User')
    yield User.query().remove()
  })

  it('should throw 401 error if jwt is not provided', function * () {
    const response = yield request(baseUrl)
      .get(`api/auth/me`)
      .expect(401)
  })

  it('should response user if jwt is valid', function * () {
    const response = yield request(baseUrl)
      .get(`api/auth/me`)
      .login(user)
      .expect(200)
    assert.equal(response.body.data.email, user.email)
    assert.equal(response.body.data.name, user.name)
  })
})
