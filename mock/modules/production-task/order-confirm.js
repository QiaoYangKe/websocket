import Mock from 'mockjs'

export default [
  {
    url: '/services/app/BranchFactoryService/orderConfirm',
    type: 'post',
    response: config => {
      return {
        result: {},
        success: true,
        error: null,
        module: 'sale',
        time: +Mock.Random.date('T')
      }
    }
  }, {
    url: '/services/app/BranchFactoryService/exitOrder',
    type: 'post',
    response: config => {
      return {
        result: {},
        success: true,
        error: null,
        module: 'sale',
        time: +Mock.Random.date('T')
      }
    }
  }, {
    url: '/services/app/BranchFactoryService/queryOrderList',
    type: 'get',
    response: config => {
      const tableData = Mock.mock({
        'data|20': [{
          'id|+1': 1,
          'factory|1': ['一分厂-河南明泰', '二分厂-河南明泰', '三分厂-河南明泰'],
          deliveryOrganization: '@word()',
          salesman: '@word()',
          production: '@word()',
          orderNo: '@word()',
          purpose: '@word()',
          alloyGrade: '@word()',
          'alloyTemper|1': ['O', 'T28', 'H29'],
          specifications: '@title(1,2)',
          number: 2,
          slices: '@integer(10, 30)',
          'dispatch|1': [0, 1],
          destinationLocation: '@word()',
          'factoryId|1': [1, 2, 3],
          dispatchDate: Mock.Random.date('T'),
          'confirm|1': [0, 1],
          branchFactoryDate: Mock.Random.date('T'),
          finishDate: Mock.Random.date('T'),
          'status|1': [0, 1, 2],
          showFlag: false
        }]
      }).data
      const { page = 1, limit = 10 } = config.query
      const pageList = tableData.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        result: {
          rows: pageList,
          total: tableData.length
        },
        success: true,
        error: null,
        module: 'sale',
        time: +Mock.Random.date('T')
      }
    }
  }
]
