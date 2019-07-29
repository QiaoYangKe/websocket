import request from '@/utils/request'

export function authenticate(data) {
  return request({
    url: '/api/TokenAuth/Authenticate',
    method: 'post',
    data
  })
}
