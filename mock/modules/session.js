export default [
  {
    url: '/services/app/Session/GetCurrentLoginInformations',
    type: 'get',
    response: config => {
      return {
        'result': {
          'application': {
            'version': '4.3.0.0',
            'releaseDate': '2019-07-26T11:27:57.3484125+08:00',
            'features': { }
          },
          'user': {
            'name': 'admin',
            'surname': 'admin',
            'userName': 'admin',
            'emailAddress': 'admin@aspnetboilerplate.com',
            'id': 1
          },
          'tenant': null
        },
        'targetUrl': null,
        'success': true,
        'error': null,
        'unAuthorizedRequest': false,
        '__almes': true
      }
    }
  }
]
