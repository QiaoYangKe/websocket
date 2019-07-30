import request from '@/utils/request'

export function getWorkCenters(params) {
  return request({
    url: '/services/app/EquipmentManagement/WorkCenter/GetWorkCenters',
    method: 'get',
    params
  })
}

export function getWorkCenterEquipments(params) {
  return request({
    url: '/services/app/EquipmentManagement/WorkCenter/GetWorkCenterEquipments',
    method: 'get',
    params
  })
}
