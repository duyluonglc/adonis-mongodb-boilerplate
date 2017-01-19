const Env = use('Env')


module.exports = {
  ally: {
    facebook: {
      clientId: Env.get('FACEBOOK_CLIENT_ID', ''),
      clientSecret: Env.get('FACEBOOK_CLIENT_SECRET', ''),
      redirectUri: Env.get('FACEBOOK_REDIRECT_URI', '')
    },
    google: {
      clientId: Env.get('GOOGLE_CLIENT_ID', ''),
      clientSecret: Env.get('GOOGLE_CLIENT_SECRET', ''),
      redirectUri: Env.get('GOOGLE_REDIRECT_URI', '')
    }
  }
}
