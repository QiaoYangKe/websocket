
const tokens = {
  admin: {
    accessToken: 'admin-accessToken',
    encryptedAccessToken: 'admin-encryptedAccessToken',
    expireInSeconds: 86400,
    userId: 1
  },
  other: {
    accessToken: 'other-accessToken',
    encryptedAccessToken: 'other-encryptedAccessToken',
    expireInSeconds: 86400,
    userId: 99
  }
}

export default [
  {
    url: '/api/TokenAuth/Authenticate',
    type: 'post',
    response: config => {
      const { userNameOrEmailAddress } = config.body
      const token = tokens[userNameOrEmailAddress]

      // mock error
      if (!token) {
        return {
          'result': null,
          'targetUrl': null,
          'success': false,
          'error': {
            'code': 0,
            'message': 'Login failed!',
            'details': 'Invalid user name or password',
            'validationErrors': null
          },
          'unAuthorizedRequest': false,
          '__almes': true
        }
      }

      return {
        'result': token,
        'targetUrl': null,
        'success': true,
        'error': null,
        'unAuthorizedRequest': false,
        '__almes': true
      }
    }
  }
]
