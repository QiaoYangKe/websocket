import request from '@/utils/request'

export function queryProductionOrder(productionOrderForm) {
  return request({
    url: '/services/app/ProductionOrder/GetAll',
    method: 'post',
    data: productionOrderForm
  })
}
