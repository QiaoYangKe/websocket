import request from '@/utils/request'

export function getBranchFactoryList() {
  return request({
    url: '/services/app/BranchFactoryService/getBranchFactoryList',
    method: 'get'
  })
}
export function updateBranchFactoryList() {
  return request({
    url: '/services/app/BranchFactoryService/updateBranchFactoryList',
    method: 'post'
  })
}
