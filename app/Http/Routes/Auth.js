'use strict'

/*
|--------------------------------------------------------------------------
| Auth Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route')

Route.group('auth', () => {
  Route.post('/register', 'Api/AuthController.register')
  Route.post('/login', 'Api/AuthController.login')
  Route.post('/logout', 'Api/AuthController.logout').middleware('auth')
  Route.post('/login/:social', 'Api/AuthController.socialLogin').middleware('ally')
  Route.get('/me', 'Api/AuthController.me').middleware('auth')
  Route.post('/forgot', 'Api/AuthController.forgot')
  Route.post('/sendVerification', 'Api/AuthController.sendVerification')
  Route.post('/password', 'Api/AuthController.password').middleware('auth')

}).prefix('/api/auth')

Route.get('auth/reset', 'Api/AuthController.getReset').as('reset')
Route.post('auth/reset', 'Api/AuthController.postReset')
Route.get('auth/verify', 'Api/AuthController.verify').as('verification')
