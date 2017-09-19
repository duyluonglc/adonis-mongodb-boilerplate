'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/guides/routing
|
*/

const Route = use('Route')

Route.get('/', ({ request }) => {
  return `
  <html>
    <head>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <section>
        <div class="logo"></div>
        <div class="title"></div>
        <div class="subtitle"><p>AdonisJs simplicity will make you feel confident about your code</p></div>
      </section>
    </body>
  </html>
  `
})

use('require-all')(`${use('Helpers').appRoot()}/app/Routes`)
