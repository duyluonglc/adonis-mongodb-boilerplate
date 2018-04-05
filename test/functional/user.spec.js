'use strict'

const Mail = use('Mail')
const User = use('App/Models/User')
const Image = use('App/Models/Image')
const Factory = use('Factory')
let user = null

{
  const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Get user')

  trait('Test/ApiClient')

  beforeEach(async () => {
    user = await Factory.model('App/Models/User').create()
  })

  afterEach(async () => {
    await User.query().delete()
  })

  test('should throw 400 error if invalid id format', async ({ client, assert }) => {
    const response = await client
      .get(`api/users/foo`)
      .accept('json')
      .end()
    response.assertStatus(400)
  })

  test('should throw 404 error if user does not exists', async ({ client, assert }) => {
    const response = await client
      .get(`api/users/507f1f77bcf86cd799439011`)
      .accept('json')
      .end()
    response.assertStatus(404)
  })

  test('should get user details', async ({ client, assert }) => {
    const response = await client
      .get(`api/users/${user._id}`)
      .accept('json')
      .end()
    response.assertStatus(200)
    assert.equal(response.body.data._id, user.toJSON()._id)
  })
}

{
  const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Update User')

  trait('Test/ApiClient')
  trait('Auth/Client')

  beforeEach(async () => {
    user = await Factory.model('App/Models/User').create()
  })

  afterEach(async () => {
    await User.query().delete()
  })

  test('should throw 401 if not login', async ({ client, assert }) => {
    const response = await client
      .put(`api/users/${user._id}`)
      .send({ locale: 'foo' })
      .accept('json')
      .end()
    response.assertStatus(401)
  })

  test('should throw 403 if not authorized', async ({ client, assert }) => {
    const otherUser = await Factory.model('App/Models/User').create()
    const response = await client
      .put(`api/users/${user._id}`)
      .loginVia(otherUser, 'jwt')
      .send({ locale: 'en' })
      .accept('json')
      .end()
    response.assertStatus(403)
  })

  // test('should throw validation error locale is invalid', async ({ client, assert }) => {
  //   const response = await client
  //     .put(`api/users/${user._id}`)
  //     .loginVia(user, 'jwt')
  //     .send({ locale: 'foo' })
  //     .accept('json')
  //     .end()
  //   response.assertStatus(422)
  // })

  test('should update user', async ({ client, assert }) => {
    const response = await client
      .put(`api/users/${user._id}`)
      .loginVia(user, 'jwt')
      .send({ locale: 'vi', name: 'John' })
      .accept('json')
      .end()
    response.assertStatus(202)
    assert.equal(response.body.data.email, user.email)
    assert.equal(response.body.data.name, 'John')
    assert.equal(response.body.data.locale, 'vi')
  })
}

{
  const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Delete user')

  trait('Test/ApiClient')
  trait('Auth/Client')

  beforeEach(async () => {
    user = await Factory.model('App/Models/User').create()
  })

  afterEach(async () => {
    await User.query().delete()
  })

  test('should throw 401 if not login', async ({ client, assert }) => {
    const response = await client
      .delete(`api/users/${user._id}`)
      .accept('json')
      .end()
    response.assertStatus(401)
  })

  test('should throw 403 if not authorized', async ({ client, assert }) => {
    const otherUser = await Factory.model('App/Models/User').create()
    const response = await client
      .delete(`api/users/${user._id}`)
      .loginVia(otherUser, 'jwt')
      .accept('json')
      .end()
    response.assertStatus(403)
  })

  test('should delete user', async ({ client, assert }) => {
    const response = await client
      .delete(`api/users/${user._id}`)
      .loginVia(user, 'jwt')
      .accept('json')
      .end()
    response.assertStatus(202)
    const newUser = await User.find(user._id)
    assert.isNull(newUser)
  })
}

{
  const { test, before, beforeEach, after, afterEach, trait } = use('Test/Suite')('Upload Image')

  trait('Test/ApiClient')
  trait('Auth/Client')

  beforeEach(async () => {
    user = await Factory.model('App/Models/User').create()
  })

  afterEach(async () => {
    await User.query().delete()
    await Image.query().delete()
  })

  test('should upload user avatar', async ({ client, assert }) => {
    const response = await client
      .post(`api/users/${user._id}/upload`)
      .loginVia(user, 'jwt')
      .field('isAvatar', 1)
      .attach('image', 'test/fixtures/demo.png')
      .accept('json')
      .end()
    response.assertStatus(202)
    const newUser = await User.find(user._id)
    const image = await newUser.images().first()
    assert.isNotNull(image)
    await image.delete()
  })
}
