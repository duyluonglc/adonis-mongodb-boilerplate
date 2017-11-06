const fs = use('fs')
const Helpers = use('Helpers')
const ImageHooks = exports = module.exports = {}

ImageHooks.removeFile = async (instance) => {
  const filePath = Helpers.publicPath(instance.filePath)
  fs.unlinkSync(filePath)
}
