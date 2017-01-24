'use strict'

/*
|--------------------------------------------------------------------------
| User Routers
|--------------------------------------------------------------------------
|
*/

const Route = use('Route')

Route.group('user', () => {
  Route.post('/', 'Api/UsersController.store')
  Route.get('/', 'Api/UsersController.index')
  Route.get('/:id', 'Api/UsersController.show').middleware(['auth:jwt,basic', 'instance:User'])
  Route.put('/:id', 'Api/UsersController.update').middleware(['auth:jwt,basic', 'instance:User', 'acl:owner'])
  Route.delete('/:id', 'Api/UsersController.destroy').middleware(['auth:jwt,basic', 'instance:User', 'acl:owner'])
}).prefix('/api/users')
