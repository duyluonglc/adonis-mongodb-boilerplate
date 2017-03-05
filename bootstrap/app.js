'use strict'

const path = require('path')

/*
|--------------------------------------------------------------------------
| Application Providers
|--------------------------------------------------------------------------
|
| Here we configure the providers required to run adonis application. They
| are registered only once and can be used inside any file using `use`
| keyword.
|
*/
const providers = [
  'adonis-framework/providers/ConfigProvider',
  'adonis-framework/providers/EnvProvider',
  'adonis-framework/providers/EventProvider',
  'adonis-framework/providers/HelpersProvider',
  'adonis-framework/providers/HashProvider',
  'adonis-framework/providers/MiddlewareProvider',
  'adonis-framework/providers/RequestProvider',
  'adonis-framework/providers/ResponseProvider',
  'adonis-framework/providers/RouteProvider',
  'adonis-framework/providers/ServerProvider',
  'adonis-framework/providers/SessionProvider',
  'adonis-framework/providers/StaticProvider',
  'adonis-framework/providers/ViewProvider',
  'adonis-lucid-mongodb/providers/DatabaseProvider',
  'adonis-lucid-mongodb/providers/LucidMongoProvider',
  'adonis-lucid-mongodb/providers/FactoryProvider',
  'adonis-middleware/providers/AppMiddlewareProvider',
  'adonis-auth/providers/AuthManagerProvider',
  'adonis-websocket/providers/WsProvider',
  'adonis-mail-provider/providers/MailProvider',
  'adonis-validation-provider/providers/ValidatorProvider',
  'adonis-ally/providers/AllyProvider',
  'adonis-filesystem/providers/FilesystemProvider',
  path.join(__dirname, '../providers/ExceptionsProvider'),
  path.join(__dirname, '../providers/ExtendValidatorProvider')
// path.join(__dirname, '../providers/ExtendRequestProvider'),
// path.join(__dirname, '../providers/ExtendResponseProvider'),
]

/*
|--------------------------------------------------------------------------
| Ace Providers
|--------------------------------------------------------------------------
|
| Ace providers are specific to ace, and are not registered when starting
| http server. It helps in reducing boot time.
|
*/
const aceProviders = [
  'adonis-lucid-mongodb/providers/CommandsProvider',
  'adonis-lucid-mongodb/providers/MigrationsProvider',
  'adonis-lucid-mongodb/providers/SchemaProvider',
  'adonis-lucid-mongodb/providers/SeederProvider',
  'adonis-ace/providers/CommandProvider',
  'adonis-commands/providers/GeneratorsProvider',
  'adonis-commands/providers/HelperCommandsProvider',
  'adonis-commands/providers/ReplProvider',
  'adonis-generators/providers/GeneratorsProvider'
]

/*
|--------------------------------------------------------------------------
| Namespace Aliases
|--------------------------------------------------------------------------
|
| Each provider is registered with a long unique namespace. Here we alias
| them with a short unique name to keep our import statements short and
| sweet.
|
*/
const aliases = {
  Command: 'Adonis/Src/Command',
  Config: 'Adonis/Src/Config',
  Database: 'Adonis/Src/Database',
  Env: 'Adonis/Src/Env',
  Event: 'Adonis/Src/Event',
  Factory: 'Adonis/Src/Factory',
  Hash: 'Adonis/Src/Hash',
  Helpers: 'Adonis/Src/Helpers',
  LucidMongo: 'Adonis/Src/LucidMongo',
  Middleware: 'Adonis/Src/Middleware',
  Route: 'Adonis/Src/Route',
  Schema: 'Adonis/Src/Schema',
  View: 'Adonis/Src/View',
  Ws: 'Adonis/Addons/Ws',
  Mail: 'Adonis/Addons/Mail',
  Validator: 'Adonis/Addons/Validator',
  Exceptions: 'Adonis/Provider/Exceptions',
  File: 'AdonisFilesystem/Filesystem'
}

/*
|--------------------------------------------------------------------------
| Ace Commands
|--------------------------------------------------------------------------
|
| Ace Commands are also are registered inside the IoC container. Here we
| register with Ace Kernel using their unique namespace.
|
*/
const commands = [
  'App/Commands/Greet',
  'Adonis/Commands/Auth:Setup',
  'Adonis/Commands/Repl',
  'Adonis/Commands/Make:Controller',
  'Adonis/Commands/Route:List',
  'Adonis/Commands/Make:Migration',
  'Adonis/Commands/Make:Model',
  'Adonis/Commands/Make:View',
  'Adonis/Commands/Make:Command',
  'Adonis/Commands/Make:Hook',
  'Adonis/Commands/Make:Middleware',
  'Adonis/Commands/Make:Seed',
  'Adonis/Commands/Make:Listener',
  'Adonis/Commands/Migration:Run',
  'Adonis/Commands/Migration:Rollback',
  'Adonis/Commands/Migration:Refresh',
  'Adonis/Commands/Migration:Reset',
  'Adonis/Commands/DB:Seed',
  'Adonis/Commands/Migration:Status',
  'Adonis/Commands/Key:Generate',
  'AdonisGenerators/Generate:Migration',
  'AdonisGenerators/Generate:Model',
  'AdonisGenerators/Generate:Controller',
  'AdonisGenerators/Generate:JsonApiView',
  'AdonisGenerators/Generate:JsonApiResource'
]

module.exports = { providers, aceProviders, aliases, commands}
