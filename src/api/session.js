import request from '@/utils/request'

export function getCurrentLoginInformations() {
  return request({
    url: '/api/services/app/Session/GetCurrentLoginInformations',
    method: 'get'
  })
}
