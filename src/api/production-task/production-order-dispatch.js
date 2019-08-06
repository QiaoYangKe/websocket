import request from '@/utils/request'

export function getBranchFactoryList() {
  return request({
    url: '/services/app/BranchFactoryService/getBranchFactoryList',
    method: 'get'
  })
}
export function confirmDispatch() {
  return request({
    url: '/services/app/BranchFactoryService/confirmDispatch',
    method: 'post'
  })
}
export function orderTranction() {
  return request({
    url: '/services/app/BranchFactoryService/orderTranction',
    method: 'post'
  })
}

export function getOrderSourceList() {
  return request({
    url: '/services/app/BranchFactoryService/getOrderSourceList',
    method: 'get'
  })
}
export function queryOrderList(ruleForm) {
  return request({
    url: '/services/app/BranchFactoryService/queryOrderList',
    method: 'get',
    params: ruleForm
  })
}
