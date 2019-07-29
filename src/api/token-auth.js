import request from '@/utils/request'

export function authenticate(data) {
  return request({
    url: '/TokenAuth/Authenticate',
    method: 'post',
    data
  })
}
