'use strict'

const Mail = use('Mail')
// const url = `http://${process.env.HOST}:${process.env.PORT}/`
const User = use('App/Models/User')
let user = null

{
  const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Account Register')

  trait('Test/ApiClient')

  afterEach(async () => {
    await User.query().delete()
  })

  test('should throw validation error when user email is missing', async ({ client, assert }) => {
    const response = await client
      .post('api/auth/register')
      .accept('json')
      .end()
    response.assertStatus(422)
    response.assertJSONSubset({
      status: 422,
      code: 'E_VALIDATE_FAILED'
    })
  })

  test('should throw validation error when user name is missing', async ({ client, assert }) => {
    const response = await client
      .post('api/auth/register')
      .send({ email: 'newuser@adonisjs.com', password: 'secret' })
      .accept('json')
      .end()

    response.assertStatus(422)
    response.assertJSONSubset({
      status: 422,
      code: 'E_VALIDATE_FAILED'
    })
  })

  test('should throw validation error when user email is invalid', async ({ client, assert }) => {
    const response = await client
      .post('api/auth/register')
      .send({ email: 'foo' })
      .accept('json')
      .end()

    response.assertStatus(422)
    response.assertJSONSubset({
      status: 422,
      code: 'E_VALIDATE_FAILED'
    })
  })

  test('should throw validation error when user password is missing', async ({ client, assert }) => {
    const response = await client
      .post('api/auth/register')
      .send({ email: 'newuser@adonisjs.com' })
      .accept('json')
      .end()
    response.assertStatus(422)
    response.assertJSONSubset({
      status: 422,
      code: 'E_VALIDATE_FAILED'
    })
  })

  test('should throw validation error if locale is invalid', async ({ client, assert }) => {
    const response = await client
      .post('api/auth/register')
      .send({ name: 'test user', email: 'newuser@adonisjs.com', password: 'secret', locale: 'xx' })
      .accept('json')
      .end()
    response.assertStatus(422)
    response.assertJSONSubset({
      status: 422,
      code: 'E_VALIDATE_FAILED'
    })
  })

  test('should throw validation error when user email address has already been taken', async ({ client, assert }) => {
    user = await use('Factory').model('App/Models/User').make()
    await user.save()
    const response = await client
      .post('api/auth/register')
      .send({ email: user.email, password: 'secret', locale: 'xx' })
      .accept('json')
      .end()

    response.assertStatus(422)
    response.assertJSONSubset({
      status: 422,
      code: 'E_VALIDATE_FAILED'
    })
  })

  test('should register a user and send registeration email', async ({ client, assert }) => {
    Mail.fake()
    const response = await client
      .post('api/auth/register')
      .send({ name: 'test user', email: 'newuser@adonisjs.com', password: 'secret', locale: 'en', age: 10 })
      .accept('json')
      .end()
    response.assertStatus(201)
    assert.equal(response.body.data.name, 'test user')
    assert.equal(response.body.data.email, 'newuser@adonisjs.com')
    assert.equal(response.body.data.locale, 'en')
    assert.isUndefined(response.body.data.age)
    // assert.isUndefined(response.body.data.verificationToken)
    // assert.isUndefined(response.body.data.verified)

    // const recentEmail = Mail.pullRecent()
    // assert.equal(recentEmail.to.address, 'newuser@adonisjs.com')
    // assert.equal(recentEmail.to.name, 'test user')

    Mail.restore()
  })
}

{
  const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Account verification')

  trait('Test/ApiClient')
  beforeEach(async () => {
    user = await use('Factory').model('App/Models/User').make()
    user.verificationToken = 'hash-verification-token'
    await user.save()
  })

  afterEach(async () => {
    const User = use('App/Models/User')
    await User.query().delete()
  })

  test('should throw error if token is invalid', async ({ client, assert }) => {
    await client
      .get(`auth/verify?token=foo`)
      .end()
  })

  test('should verify user and redirect to home page', async ({ client, assert }) => {
    await client
      .get(`auth/verify?token=hash-verification-token`)
      .end()
    const user = await User.first()
    assert.equal(user.verified, true)
  })
}

{
  const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Auth login')

  trait('Test/ApiClient')
  beforeEach(async () => { })

  afterEach(async () => {
    await User.query().delete()
  })

  test('should throw 401 error when user email is not registered', async ({ client, assert }) => {
    const response = await client
      .post(`api/auth/login`)
      .send({ email: 'foo@email', password: 'test@password' })
      .accept('json')
      .end()
    response.assertStatus(401)
  })

  test('should throw 401 error if password is invalid', async ({ client, assert }) => {
    user = await use('Factory').model('App/Models/User').make()
    user.verified = true
    await user.save()
    const response = await client
      .post(`api/auth/login`)
      .send({ email: user.email, password: 'foo@password' })
      .end()
    response.assertStatus(401)
  })

  test('should throw 401 error when user email is not verified', async ({ client, assert }) => {
    user = await use('Factory').model('App/Models/User').make()
    user.verified = false
    await user.save()
    const response = await client
      .post(`api/auth/login`)
      .send({ email: user.email, password: user.password })
      .end()
    response.assertStatus(401)
  })

  test('should generate jwt token if password is valid', async ({ client, assert }) => {
    user = await use('Factory').model('App/Models/User').make()
    user.verified = true
    user.password = 'secret'
    await user.save()
    const response = await client
      .post(`api/auth/login`)
      .send({ email: user.email, password: 'secret' })
      .accept('json')
      .end()
    response.assertStatus(200)
    assert.isNotNull(response.body.data.token)
    assert.equal(response.body.data.user.email, user.email)
  })
}

{
  // const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Auth social login')

  // trait('Test/ApiClient')
  // beforeEach(async () => { })

  // afterEach(async () => {
  //   await User.query().delete()
  // })

  // test('should throw 422 error token is not provided', async ({ client, assert }) => {
  //   user = await use('Factory').model('App/Models/User').make()
  //   user.verified = true
  //   await user.save()
  //   const response = await client
  //     .post(`api/auth/login/facebook`)
  //     .accept('json')
  //     .end()
  //   response.assertStatus(422)
  // })

  // test('should throw 401 error facebook token invalid', async ({ client, assert }) => {
  //   user = await use('Factory').model('App/Models/User').make()
  //   user.verified = true
  //   await user.save()
  //   const response = await client
  //     .post(`api/auth/login/facebook`)
  //     .send({ socialToken: 'bad token' })
  //     .end()
  //   response.assertStatus(401)
  // })

  // test('should throw 401 error google token invalid', async ({ client, assert }) => {
  //   user = await use('Factory').model('App/Models/User').make()
  //   user.verified = true
  //   await user.save()
  //   const response = await client
  //     .post(`api/auth/login/google`)
  //     .send({ socialToken: 'bad token' })
  //     .end()
  //   response.assertStatus(401)
  // })
}

{
  const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Auth me')

  trait('Test/ApiClient')
  trait('Auth/Client')

  beforeEach(async () => {
    user = await use('Factory').model('App/Models/User').make()
    user.verified = false
    await user.save()
  })

  afterEach(async () => {
    const User = use('App/Models/User')
    await User.query().delete()
  })

  test('should throw 401 error if jwt is not provided', async ({ client, assert }) => {
    const response = await client
      .get(`api/auth/me`)
      .end()
    response.assertStatus(401)
  })

  test('should response user if jwt is valid', async ({ client, assert }) => {
    const response = await client
      .get(`api/auth/me`)
      .loginVia(user, 'jwt')
      .accept('json')
      .end()
    response.assertStatus(200)
    assert.equal(response.body.data.email, user.email)
    assert.equal(response.body.data.name, user.name)
  })
}

{
  const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Auth change password')

  trait('Test/ApiClient')
  trait('Auth/Client')

  beforeEach(async () => {
    user = await use('Factory').model('App/Models/User').make()
    user.verified = false
    await user.save()
  })

  afterEach(async () => {
    const User = use('App/Models/User')
    await User.query().delete()
  })

  test('should throw 401 error if jwt is not provided', async ({ client, assert }) => {
    const response = await client
      .post(`api/auth/password`)
      .end()
    response.assertStatus(401)
  })

  test('should throw 422 error password is not provided', async ({ client, assert }) => {
    const response = await client
      .post(`api/auth/password`)
      .send({ newPassword: 'test-password' })
      .loginVia(user, 'jwt')
      .accept('json')
      .end()
    response.assertStatus(422)
  })

  test('should throw 422 error new password is not provided', async ({ client, assert }) => {
    const response = await client
      .post(`api/auth/password`)
      .send({ password: 'test-password' })
      .loginVia(user, 'jwt')
      .accept('json')
      .end()
    response.assertStatus(422)
  })

  test('should throw 422 error password is not match', async ({ client, assert }) => {
    const response = await client
      .post(`api/auth/password`)
      .send({ password: 'test-password', newPassword: 'new-password' })
      .loginVia(user, 'jwt')
      .accept('json')
      .end()
    response.assertStatus(422)
  })

  test('should change the password if password is valid', async ({ client, assert }) => {
    const user = await User.create({
      email: 'test@gmail.com',
      password: 'secret'
    })
    const oldUser = await User.find(user._id)
    const response = await client
      .post(`api/auth/password`)
      .send({ password: 'secret', newPassword: 'new-password' })
      .loginVia(user, 'jwt')
      .accept('json')
      .end()
    response.assertStatus(200)
    const newUser = await User.find(user._id)
    assert.notEqual(newUser.password, oldUser.password)
  })
}

{
  const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Auth forgot')

  trait('Test/ApiClient')
  beforeEach(async () => {
    user = await use('Factory').model('App/Models/User').make()
    user.verified = false
    await user.save()
  })

  afterEach(async () => {
    const User = use('App/Models/User')
    await User.query().delete()
  })

  test('should throw 422 error if email is not provided', async ({ client, assert }) => {
    const response = await client
      .post(`api/auth/forgot`)
      .accept('json')
      .end()
    response.assertStatus(422)
  })

  test('should throw 404 error if email is not found', async ({ client, assert }) => {
    const response = await client
      .post(`api/auth/forgot`)
      .send({ email: 'test@gmail.com' })
      .accept('json')
      .end()
    response.assertStatus(404)
  })

  test('should send email and response 200 success if email is registered', async ({ client, assert }) => {
    Mail.fake()
    const response = await client
      .post(`api/auth/forgot`)
      .send({ email: user.email })
      .accept('json')
      .end()
    response.assertStatus(200)

    const recentEmail = Mail.pullRecent()
    assert.equal(recentEmail.envelope.to[0], user.email)
    assert.equal(recentEmail.message.subject, 'Reset your password')

    Mail.restore()
  })
}

{
  const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Auth resend verification email')

  trait('Test/ApiClient')
  beforeEach(async () => {
    user = await use('Factory').model('App/Models/User').make()
    user.verified = false
    await user.save()
  })

  afterEach(async () => {
    const User = use('App/Models/User')
    await User.query().delete()
  })

  test('should throw 422 error if email is not provided', async ({ client, assert }) => {
    const response = await client
      .post(`api/auth/sendVerification`)
      .accept('json')
      .end()
    response.assertStatus(422)
  })

  test('should throw 404 error if email is not found', async ({ client, assert }) => {
    const response = await client
      .post(`api/auth/sendVerification`)
      .send({ email: 'test@gmail.com' })
      .accept('json')
      .end()
    response.assertStatus(404)
  })

  test('should send email and response 200 success if email is registered', async ({ client, assert }) => {
    Mail.fake()
    const response = await client
      .post(`api/auth/sendVerification`)
      .send({ email: user.email })
      .accept('json')
      .end()
    response.assertStatus(200)

    const recentEmail = Mail.pullRecent()
    assert.equal(recentEmail.envelope.to[0], user.email)
    assert.equal(recentEmail.message.subject, 'Please Verify Your Email Address')

    Mail.restore()
  })
}

// {
//   const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Auth get reset')

//   // trait('Test/ApiClient')
//   trait('Test/Browser')

//   beforeEach(async () => {
//     user = await use('Factory').model('App/Models/User').make()
//     user.verificationToken = 'very-long-hash-string'
//     await user.save()
//   })

//   afterEach(async () => {
//     const User = use('App/Models/User')
//     await User.query().delete()
//   })

//   test('should throw 400 error if token is invalid', async ({ browser, assert }) => {
//     const page = await browser
//       .visit(`auth/reset?token=long-hash-token`)
//     page.assertStatus(400)
//   })

//   test('should throw 400 error if token is invalid', async ({ browser, assert }) => {
//     const page = await browser
//       .visit(`auth/reset?token=${user.verificationToken}`)
//       .accept('json')
//     page.assertStatus(400)
//   })
// }

// {
//   const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Auth post reset')

//   trait('Test/ApiClient')

//   beforeEach(async () => {
//     user = await use('Factory').model('App/Models/User').make()
//     user.verificationToken = 'very-long-hash-string'
//     await user.save()
//   })

//   afterEach(async () => {
//     const User = use('App/Models/User')
//     await User.query().delete()
//   })

//   test('should go back with error if password is not provided', async ({ client, assert }) => {
//     const response = await client.post(`auth/reset`)
//       .send({ token: user.verificationToken })
//       .accept('json')
//       .end()
//     response.assertStatus(400)
//   })

//   test('should go back with error if password confirmation is not match', async ({ client, assert }) => {
//     const response = await client.post(`auth/reset`)
//       .send({
//         token: user.verificationToken,
//         password: 'new-password',
//         passwordConfirmation: 'password-confirmation'
//       })
//       .accept('json')
//       .end()
//     response.assertStatus(422)
//   })

//   test('should throw 400 error if token is invalid', async ({ client, assert }) => {
//     const response = await client.post(`auth/reset?token=long-hash-token`)
//       .send({
//         token: 'invalid-token',
//         password: 'new-password',
//         passwordConfirmation: 'new-password'
//       })
//       .accept('json')
//       .end()
//     response.assertStatus(400)
//   })

//   test('should change password and redirect when token is valid', async ({ client, assert }) => {
//     const oldUser = await User.find(user._id)
//     await client.post(`auth/reset`)
//       .send({
//         token: user.verificationToken,
//         password: 'new-password',
//         passwordConfirmation: 'new-password'
//       })
//       .end()
//     const newUser = await User.find(user._id)
//     assert.isUndefined(newUser.verificationToken)
//     assert.notEqual(newUser.password, oldUser.password)
//   })
// }
