import request from '@/utils/request'

export function getBranchFactoryList() {
  return request({
    url: '/services/app/FactoryService/GetAllFactory',
    method: 'get'
  })
}
export function confirmDispatch(orders) {
  return request({
    url: '/services/app/ProductionOrder/ConfirmDispatch',
    method: 'post',
    data: orders
  })
}
export function orderTranction(orders) {
  return request({
    url: '/services/app/ProductionOrder/OrderTranction',
    method: 'post',
    data: orders
  })
}

export function getOrderSourceList() {
  return request({
    url: '/services/app/SalesGroupService/GetAllSalesGroup',
    method: 'get'
  })
}
export function queryOrderList(ruleForm) {
  return request({
    url: '/services/app/ProductionOrder/GetOrderItemList',
    method: 'post',
    data: ruleForm
  })
}
