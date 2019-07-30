export default [
  {
    url: '/services/app/EquipmentManagement/WorkCenter/GetWorkCenters',
    type: 'get',
    response: config => {
      return {
        'result': [
          { id: '010101', name: '轧机' },
          { id: '010102', name: '拉弯矫' },
          { id: '010103', name: '飞剪' },
          { id: '010104', name: '分切' },
          { id: '010105', name: '纵剪' },
          { id: '010106', name: '退火炉' },
          { id: '010107', name: '开平剪' }
        ],
        'targetUrl': null,
        'success': true,
        'error': null,
        'unAuthorizedRequest': false,
        '__almes': true
      }
    }
  },
  {
    url: '/services/app/EquipmentManagement/WorkCenter/GetWorkCenterEquipments',
    type: 'get',
    response: config => {
      const { workCenterId } = config.query

      const data = {
        '010101': [
          { id: '010101001', name: '1#轧机', currentBatchCount: 8 },
          { id: '010101002', name: '2#轧机', currentBatchCount: 12 },
          { id: '010101003', name: '3#轧机', currentBatchCount: 11 },
          { id: '010101004', name: '4#轧机', currentBatchCount: 15 }
        ],
        '010102': [
          { id: '010102001', name: '1#拉弯矫', currentBatchCount: 9 },
          { id: '010102002', name: '2#拉弯矫', currentBatchCount: 7 },
          { id: '010102003', name: '3#拉弯矫', currentBatchCount: 16 },
          { id: '010102004', name: '4#拉弯矫', currentBatchCount: 4 }
        ],
        '010103': [
          { id: '010103001', name: '1#飞剪', currentBatchCount: 11 },
          { id: '010103002', name: '2#飞剪', currentBatchCount: 16 },
          { id: '010103003', name: '3#飞剪', currentBatchCount: 10 },
          { id: '010103004', name: '4#飞剪', currentBatchCount: 22 }
        ],
        '010104': [
          { id: '010104001', name: '1#分切', currentBatchCount: 3 },
          { id: '010104002', name: '2#分切', currentBatchCount: 7 },
          { id: '010104003', name: '3#分切', currentBatchCount: 12 },
          { id: '010104004', name: '4#分切', currentBatchCount: 5 }
        ],
        '010105': [
          { id: '010105001', name: '1#纵剪', currentBatchCount: 3 },
          { id: '010105002', name: '2#纵剪', currentBatchCount: 1 },
          { id: '010105003', name: '3#纵剪', currentBatchCount: 5 },
          { id: '010105004', name: '4#纵剪', currentBatchCount: 8 }
        ],
        '010106': [
          { id: '010106001', name: '1#退火炉', currentBatchCount: 7 },
          { id: '010106002', name: '2#退火炉', currentBatchCount: 15 },
          { id: '010106003', name: '3#退火炉', currentBatchCount: 43 },
          { id: '010106004', name: '4#退火炉', currentBatchCount: 22 }
        ],
        '010107': [
          { id: '010107001', name: '1#开平剪', currentBatchCount: 10 },
          { id: '010107002', name: '2#开平剪', currentBatchCount: 12 },
          { id: '010107003', name: '3#开平剪', currentBatchCount: 7 },
          { id: '010107004', name: '4#开平剪', currentBatchCount: 6 }
        ]

      }

      return {
        'result': data[workCenterId],
        'targetUrl': null,
        'success': true,
        'error': null,
        'unAuthorizedRequest': false,
        '__almes': true
      }
    }
  }
]
