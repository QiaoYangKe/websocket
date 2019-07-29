import request from '@/utils/request'

export function getCurrentLoginInformations() {
  return request({
    url: '/services/app/Session/GetCurrentLoginInformations',
    method: 'get'
  })
}
