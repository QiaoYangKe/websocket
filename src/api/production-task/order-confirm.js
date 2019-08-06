import request from '@/utils/request'

export function confirmOrder() {
  return request({
    url: '/services/app/BranchFactoryService/confirmOrder',
    method: 'post'
  })
}
export function exitOrder() {
  return request({
    url: '/services/app/BranchFactoryService/exitOrder',
    method: 'post'
  })
}
export function queryOrderResult(ruleForm) {
  return request({
    url: '/services/app/BranchFactoryService/queryOrderList',
    method: 'get',
    params: ruleForm
  })
}
