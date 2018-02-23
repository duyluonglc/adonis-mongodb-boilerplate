'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider
const apisauce = use('apisauce')

class SocialAuthProvider extends ServiceProvider {
  register () {
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
        verifyToken: async (network, socialToken) => {
          const response = await apisauce.create({baseURL: providers[network].url})
            .get('', { access_token: socialToken })
          if (response.ok) {
            return response.data
          }
          return null
        }
      }
    })
  }
}

module.exports = SocialAuthProvider
