const fs = use('fs')
const Helpers = use('Helpers')
const Image = exports = module.exports = {}

Image.removeFile = function * (next) {
  fs.unlinkSync(Helpers.publicPath(`uploads/${this.fileName}`))
  yield next
}
