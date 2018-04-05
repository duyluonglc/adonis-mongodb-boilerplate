'use strict'

const Helpers = use('Helpers')
/*
|--------------------------------------------------------------------------
| Providers
|--------------------------------------------------------------------------
|
| Providers are building blocks for your Adonis app. Anytime you install
| a new Adonis specific package, chances are you will register the
| provider here.
|
*/
const providers = [
  '@adonisjs/framework/providers/AppProvider',
  '@adonisjs/framework/providers/ViewProvider',
  '@adonisjs/bodyparser/providers/BodyParserProvider',
  '@adonisjs/cors/providers/CorsProvider',
  '@adonisjs/shield/providers/ShieldProvider',
  '@adonisjs/auth/providers/AuthProvider',
  '@adonisjs/mail/providers/MailProvider',
  '@adonisjs/validator/providers/ValidatorProvider',
  '@adonisjs/vow/providers/VowProvider',
  '@adonisjs/session/providers/SessionProvider',
  '@adonisjs/ally/providers/AllyProvider',
  'lucid-mongo/providers/LucidMongoProvider',
  Helpers.appRoot('app/Providers/ExtendValidatorProvider'),
  Helpers.appRoot('app/Providers/ExtendResponseProvider'),
  Helpers.appRoot('app/Providers/BindInstanceProvider')
]

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are required only when running ace commands. For example
| Providers for migrations, tests etc.
|
*/
const aceProviders = [
  'lucid-mongo/providers/MigrationsProvider',
  '@adonisjs/vow-browser/providers/VowBrowserProvider'
]

/*
|--------------------------------------------------------------------------
| Aliases
|--------------------------------------------------------------------------
|
| Aliases are short unique names for IoC container bindings. You are free
| to create your own aliases.
|
| For example:
|   { Route: 'Adonis/Src/Route' }
|
*/
const aliases = {
  Exceptions: 'App/Exceptions'
}

/*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| Here you store ace commands for your package
|
*/
const commands = [
  'App/Commands/Swagger'
]

module.exports = { providers, aceProviders, aliases, commands }
