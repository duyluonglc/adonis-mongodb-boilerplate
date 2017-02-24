'use strict'

const Env = use('Env')
const Helpers = use('Helpers')

module.exports = {
  default: 'public',

  public: {
    driver: 'local',
    root: Helpers.publicPath('uploads'),
    options: {
      encoding: 'utf8'
    }
  },

  protected: {
    driver: 'local',
    root: Helpers.storagePath('app'),
    options: {
      encoding: 'utf8'
    }
  }

}
