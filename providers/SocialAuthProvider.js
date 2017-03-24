'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider
const request = use('request')

class SocialAuthProvider extends ServiceProvider {

  * register () {
    this.app.bind('Adonis/Auth/Social', function () {
      const providers = {
        facebook: {
          url: 'https://graph.facebook.com/me?fields=id,name,email,locale,picture.width(1024)'
        },
        google: {
          url: 'https://www.googleapis.com/oauth2/v3/userinfo'
        }
      }
      return {
        verifyToken: function (network, socialToken) {
          return new Promise(function (resolve, reject) {
            request({
              url: providers[network].url,
              qs: { access_token: socialToken }
            }, function (error, response, body) {
              if (!error && response.statusCode === 200) {
                resolve(JSON.parse(body))
              } else {
                resolve(null)
              }
            })
          })
        }
      }
    })
  }

}

module.exports = SocialAuthProvider
