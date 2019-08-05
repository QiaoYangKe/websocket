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

export default [
  {
    url: '/services/app/BranchFactoryService/getBranchFactoryList',
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
    url: '/services/app/BranchFactoryService/updateBranchFactoryList',
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
  }
]
