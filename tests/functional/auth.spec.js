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
    yield request(baseUrl)
      .get(`auth/verify?token=foo`)
      .expect(400)
  })

  it('should verify user and redirect to home page', function * () {
    yield request(baseUrl)
      .get(`auth/verify?token=hash-verification-token`)
      .expect(302)
    const user = yield User.first()
    assert.equal(user.verified, true)
  })
})

describe('Auth login', function () {
  beforeEach(function * () {})

  afterEach(function * () {
    yield User.query().remove()
  })

  it('should throw 404 error when user email is not registered', function * () {
    const response = yield request(baseUrl)
      .post(`api/auth/login`)
      .send({email: 'foo@email', password: 'test@password'})
      .expect(404)
    assert.equal(response.body.statusCode, 404)
  })

  it('should throw 401 error if password is invalid', function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verified = true
    yield user.save()
    const response = yield request(baseUrl)
      .post(`api/auth/login`)
      .send({email: user.email, password: 'foo@password'})
      .expect(401)
    assert.equal(response.body.statusCode, 401)
  })

  it('should throw 401 error when user email is not verified', function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verified = false
    yield user.save()
    const response = yield request(baseUrl)
      .post(`api/auth/login`)
      .send({email: user.email, password: user.password})
      .expect(401)
    assert.equal(response.body.statusCode, 401)
  })

  it('should generate jwt token if password is valid', function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verified = true
    yield user.save()
    const response = yield request(baseUrl)
      .post(`api/auth/login`)
      .send({email: user.email, password: user.password})
      .expect(200)
    assert.equal(response.body.statusCode, 200)
    assert.isNotNull(response.body.data.token)
    assert.equal(response.body.data.email, user.email)
  })
})

describe('Auth social login', function () {
  beforeEach(function * () {})

  afterEach(function * () {
    yield User.query().remove()
  })

  it('should throw 422 error token is not provided', function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verified = true
    yield user.save()
    const response = yield request(baseUrl)
      .post(`api/auth/login/facebook`)
      .expect(422)
    assert.equal(response.body.statusCode, 422)
  })

  it('should throw 401 error facebook token invalid', function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verified = true
    yield user.save()
    const response = yield request(baseUrl)
      .post(`api/auth/login/facebook`)
      .send({socialToken: 'bad token'})
      .expect(401)
    assert.equal(response.body.statusCode, 401)
  })

  it('should throw 401 error google token invalid', function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verified = true
    yield user.save()
    const response = yield request(baseUrl)
      .post(`api/auth/login/google`)
      .send({socialToken: 'bad token'})
      .expect(401)
    assert.equal(response.body.statusCode, 401)
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
    assert.equal(response.body.statusCode, 401)
  })

  it('should response user if jwt is valid', function * () {
    const response = yield request(baseUrl)
      .get(`api/auth/me`)
      .login(user)
      .expect(200)
    assert.equal(response.body.statusCode, 200)
    assert.equal(response.body.data.email, user.email)
    assert.equal(response.body.data.name, user.name)
  })
})

describe('Auth change password', function () {
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
      .post(`api/auth/password`)
      .expect(401)
    assert.equal(response.body.statusCode, 401)
  })

  it('should throw 422 error password is not provided', function * () {
    const response = yield request(baseUrl)
      .post(`api/auth/password`)
      .send({newPassword: 'test-password'})
      .login(user)
      .expect(422)
    assert.equal(response.body.statusCode, 422)
  })

  it('should throw 422 error new password is not provided', function * () {
    const response = yield request(baseUrl)
      .post(`api/auth/password`)
      .send({password: 'test-password'})
      .login(user)
      .expect(422)
    assert.equal(response.body.statusCode, 422)
  })

  it('should throw 422 error password is not match', function * () {
    const response = yield request(baseUrl)
      .post(`api/auth/password`)
      .send({password: 'test-password', newPassword: 'new-password'})
      .login(user)
      .expect(422)
    assert.equal(response.body.statusCode, 422)
  })

  it('should change the password if password is valid', function * () {
    const oldUser = yield User.find(user._id)
    const response = yield request(baseUrl)
      .post(`api/auth/password`)
      .send({password: user.password, newPassword: 'new-password'})
      .login(user)
      .expect(200)
    assert.equal(response.body.statusCode, 200)
    const newUser = yield User.find(user._id)
    assert.notEqual(newUser.password, oldUser.password)
  })
})

describe('Auth forgot', function () {
  beforeEach(function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verified = false
    yield user.save()
  })

  afterEach(function * () {
    const User = use('App/Models/User')
    yield User.query().remove()
  })

  it('should throw 422 error if email is not provided', function * () {
    const response = yield request(baseUrl)
      .post(`api/auth/forgot`)
      .expect(422)
    assert.equal(response.body.statusCode, 422)
  })

  it('should throw 404 error if email is not found', function * () {
    const response = yield request(baseUrl)
      .post(`api/auth/forgot`)
      .send({email: 'test@gmail.com'})
      .expect(404)
    assert.equal(response.body.statusCode, 404)
  })

  it('should send email and response 200 success if email is registered', function * () {
    const response = yield request(baseUrl)
      .post(`api/auth/forgot`)
      .send({email: user.email})
      .expect(200)
    assert.equal(response.body.statusCode, 200)
  })
})

describe('Auth resend verification email', function () {
  beforeEach(function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verified = false
    yield user.save()
  })

  afterEach(function * () {
    const User = use('App/Models/User')
    yield User.query().remove()
  })

  it('should throw 422 error if email is not provided', function * () {
    const response = yield request(baseUrl)
      .post(`api/auth/sendVerification`)
      .expect(422)
    assert.equal(response.body.statusCode, 422)
  })

  it('should throw 404 error if email is not found', function * () {
    const response = yield request(baseUrl)
      .post(`api/auth/sendVerification`)
      .send({email: 'test@gmail.com'})
      .expect(404)
    assert.equal(response.body.statusCode, 404)
  })

  it('should send email and response 200 success if email is registered', function * () {
    const response = yield request(baseUrl)
      .post(`api/auth/sendVerification`)
      .send({email: user.email})
      .expect(200)
    assert.equal(response.body.statusCode, 200)
  })
})

describe('Auth get reset', function () {
  beforeEach(function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verificationToken = 'very-long-hash-string'
    yield user.save()
  })

  afterEach(function * () {
    const User = use('App/Models/User')
    yield User.query().remove()
  })

  it('should throw 400 error if token is invalid', function * () {
    yield request(baseUrl)
      .get(`auth/reset?token=long-hash-token`)
      .expect(400)
  })

  it('should throw 400 error if token is invalid', function * () {
    yield request(baseUrl)
      .get(`auth/reset?token=${user.verificationToken}`)
      .expect(200)
  })
})

describe('Auth post reset', function () {
  beforeEach(function * () {
    user = use('Factory').model('App/Models/User').make()
    user.verificationToken = 'very-long-hash-string'
    yield user.save()
  })

  afterEach(function * () {
    const User = use('App/Models/User')
    yield User.query().remove()
  })

  it('should go back with error if password is not provided', function * () {
    yield request(baseUrl).post(`auth/reset`)
      .send({token: user.verificationToken})
      .expect(422)
  })

  it('should go back with error if password confirmation is not match', function * () {
    yield request(baseUrl).post(`auth/reset`)
      .send({
        token: user.verificationToken,
        password: 'new-password',
        passwordConfirmation: 'password-confirmation'
      })
      .expect(422)
  })

  it('should throw 400 error if token is invalid', function * () {
    yield request(baseUrl).post(`auth/reset?token=long-hash-token`)
      .send({
        token: 'invalid-token',
        password: 'new-password',
        passwordConfirmation: 'new-password'
      })
      .expect(400)
  })

  it('should change password and redirect when token is valid', function * () {
    const oldUser = yield User.find(user._id)
    yield request(baseUrl).post(`auth/reset`)
      .send({
        token: user.verificationToken,
        password: 'new-password',
        passwordConfirmation: 'new-password'
      })
      .expect(302)
    const newUser = yield User.find(user._id)
    assert.isUndefined(newUser.verificationToken)
    assert.notEqual(newUser.password, oldUser.password)
  })
})
