const fs = use('fs')
const Helpers = use('Helpers')
const ImageHooks = exports = module.exports = {}

ImageHooks.removeFile = function * (next) {
  fs.unlinkSync(Helpers.publicPath(`uploads/${this.fileName}`))
  yield next
}
