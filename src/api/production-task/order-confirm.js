import request from '@/utils/request'

export function confirmOrder(orders) {
  return request({
    url: '/services/app/ProductionOrder/ConfirmOrder',
    method: 'post',
    data: orders
  })
}
export function exitOrder(orders) {
  return request({
    url: '/services/app/BranchFactoryService/exitOrder',
    method: 'post',
    data: orders
  })
}
export function queryOrderResult(ruleForm) {
  return request({
    url: '/services/app/ProductionOrder/GetOrderItemConfirmList',
    method: 'get',
    params: ruleForm
  })
}
