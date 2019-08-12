import Mock from 'mockjs'

const branchFactoryList = [{
  'id': 1,
  'name': '一分厂-河南明泰'
}, {
  'id': 2,
  'name': '二分厂-河南明泰'
}, {
  'id': 3,
  'name': '三分厂-河南明泰'
}]
const orderSourceList = [{
  'id': 1,
  'name': '订单来源mock1'
}, {
  'id': 2,
  'name': '订单来源mock2'
}, {
  'id': 3,
  'name': '订单来源mock3'
}]
// const tableData = [
//   {
//     id: 1,
//     factory: '一分厂-河南明泰',
//     deliveryOrganization: 'aaa',
//     salesman: 'aa',
//     production: 'aa',
//     orderNo: 'a',
//     purpose: 'a',
//     alloyGrade: 'a',
//     status: 'a',
//     specifications: 'a',
//     number: 2,
//     slices: '',
//     dispatch: '1',
//     destinationLocation: 'a',
//     factoryId: 1,
//     dispatchDate: new Date(),
//     comfirm: 'a',
//     branchFactoryDate: new Date().getTime(),
//     finishDate: new Date().getTime(),
//     showFlag: false
//   }, {
//     id: 2,
//     factory: '二分厂-河南明泰',
//     deliveryOrganization: 'aaa',
//     salesman: 'aa',
//     production: 'aa',
//     orderNo: 'a',
//     purpose: 'a',
//     alloyGrade: 'a',
//     status: 'a',
//     specifications: 'a',
//     number: 2,
//     slices: '',
//     dispatch: '1',
//     factoryId: 2,
//     destinationLocation: 'a',
//     dispatchDate: new Date(),
//     comfirm: 'a',
//     branchFactoryDate: new Date().getTime(),
//     finishDate: new Date().getTime(),
//     showFlag: false
//   }]
export default [
  {
    url: '/services/app/FactoryService/GetAllFactory',
    type: 'get',
    response: config => {
      return {
        result: branchFactoryList,
        success: true,
        error: null,
        module: 'sale',
        time: +Mock.Random.date('T')
      }
    }
  }, {
    url: '/services/app/BranchFactoryService/orderTranction',
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
    url: '/services/app/ProductionOrder/ConfirmDispatch',
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
    url: '/services/app/SalesGroupService/GetAllSalesGroup',
    type: 'get',
    response: config => {
      return {
        result: orderSourceList,
        success: true,
        error: null,
        module: 'sale',
        time: +Mock.Random.date('T')
      }
    }
  }, {
    url: '/services/app/ProductionOrder/GetOrderItemList',
    type: 'post',
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
          'deliveryOrgId|1': [1, 2, 3],
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
