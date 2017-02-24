const Hash = use('Hash')
const User = exports = module.exports = {}

User.encryptPassword = function * (next) {
  this.password = yield Hash.make(this.password)
  yield next
}
