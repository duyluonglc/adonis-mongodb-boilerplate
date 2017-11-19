'use strict'

{
  const { test, trait } = use('Test/Suite')('Get swagger spec')

  trait('Test/ApiClient')

  test('should response json of swagger spec', async ({ client }) => {
    const response = await client
      .get(`/api-specs`)
      .accept('json')
      .end()
    response.assertStatus(200)
    response.assertJSONSubset({
      info: {
        title: 'My REST API',
        version: '1.0.0'
      }
    })
  })
}

// {
//   const { test, trait } = use('Test/Suite')('Get swagger ui')

//   trait('Test/Browser')

//   test('should response swagger ui page', async ({ browser }) => {
//     const page = await browser.visit(`/docs`)
//     await page.assertHas('swagger')
//     await page
//       .waitForElement('My REST API')
//   })
// }
