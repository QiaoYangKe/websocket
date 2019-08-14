import request from '@/utils/request'

export function queryProductionOrder(productionOrderForm) {
  return request({
    url: '/services/app/ProductionOrder/GetAll',
    method: 'get',
    params: productionOrderForm
  })
}
