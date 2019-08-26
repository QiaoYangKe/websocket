<template>
  <el-container>
    <el-header class="factory-header" style="min-width: 1250px;" height="40px">
      <el-button size="mini" type="primary" plain :disabled="orderTranction" @click="confirmDispatchTask"><i class="el-icon-check">&nbsp;</i> 提交审批</el-button>
      <el-button size="mini" type="primary" plain :disabled="orderTranction" @click="changeBranchFactory"><i class="el-icon-notebook-2">&nbsp;</i> 变更</el-button>
      <el-button size="mini" type="primary" plain :disabled="!orderTranction" @click="orderTranctionTask"><i class="el-icon-edit">&nbsp;</i> 终止</el-button>
    </el-header>
    <el-main style="overflow: hidden">
      <el-form ref="productionOrderForm" size="mini" :model="productionOrderForm" :rules="rules" label-width="100px" class="demo-ruleForm search-form">
        <el-row :gutter="10" style="width: 100%" class="el-row-style">
          <el-col :span="10">
            <el-form-item label="制单日期" required>
              <el-col :span="11">
                <el-form-item prop="dateStart">
                  <el-date-picker v-model="productionOrderForm.dateStart" type="date" placeholder="开始日期" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1">-</el-col>
              <el-col :span="12">
                <el-form-item prop="dateEnd">
                  <el-date-picker v-model="productionOrderForm.dateEnd" placeholder="截止日期" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="合同编号" prop="orderNo">
              <el-input v-model="productionOrderForm.orderNo" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="销售客户" prop="clientName">
              <el-input v-model="productionOrderForm.clientName" />
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button type="primary" @click="query()">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="width: 100%" class="el-row-style">
          <el-col :span="5">
            <el-form-item label="订单状态" prop="productionOrderProcessState">
              <el-select v-model="productionOrderForm.productionOrderProcessState" clearable placeholder="请选择订单状态" loading-text="加载中..." @change="query()">
                <el-option
                  v-for="item in productionOrderProcessStateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="订单来源" prop="SalesGroupIds" @change="query()">
              <el-select v-model="productionOrderForm.SalesGroupIds" clearable multiple :loading="orderSourceLoading" placeholder="请选择订单来源" loading-text="加载中...">
                <el-option
                  v-for="item in orderSourceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="是否变更" prop="revised" @change="revisedChange(productionOrderForm.revised)">
              <el-select v-model="productionOrderForm.revised" clearable placeholder="请选择">
                <el-option label="是" :value="true" />
                <el-option label="否" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="业务员" prop="SalesmanName">
              <el-input v-model="productionOrderForm.SalesmanName" />
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button @click="resetForm('productionOrderForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="orderTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :height="tableHeight"
        :row-class-name="tableRowClassName"
        border
        @selection-change="handleSelectionChange"
        @row-click="clickRow"
      >
        <el-table-column
          type="selection"
          width="40px"
          align="center"
        />
        <el-table-column
          v-for="item in cols"
          :key="item.props"
          :prop="item.props"
          :label="item.label"
          :width="item.width"
          :align="item.align"
          :fixed="item.fixed"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div v-if="item.props === 'creationTime'">
              {{ scope.row.creationTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </div>
            <div v-else-if="item.props === 'processState'">
              <span v-if="scope.row.processState === 0">编辑中</span>
              <span v-else-if="scope.row.processState === 1">审批中</span>
              <span v-else-if="scope.row.processState === 2">审批通过</span>
              <span v-else-if="scope.row.processState === 3">已下发</span>
              <span v-else-if="scope.row.processState === 4">已确认</span>
              <span v-else-if="scope.row.processState === 5">分坯中</span>
              <span v-else-if="scope.row.processState === 6">生产中</span>
              <span v-else-if="scope.row.processState === 7">完工</span>
            </div>
            <div v-else>
              <span>{{ scope.row[item.props] }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination v-show="total>0" :total="total" :page.sync="productionOrderForm.page" :limit.sync="productionOrderForm.limit" @pagination="query" />
    </el-main>
  </el-container>
</template>

<script>
import { parseTime } from '@/utils'
import { getOrderSourceList } from '@/api/production-task/production-order-dispatch'
import { queryProductionOrder } from '@/api/production-task/production-order'
import Pagination from '@/components/Pagination/index.vue'
export default {
  name: 'ProductionOrderDispatch',
  filters: {
    parseTime
  },
  components: { Pagination },
  data() {
    return {
      productionOrderProcessStateList: [
        {
          id: 0,
          name: '编辑中'
        },
        {
          id: 1,
          name: '审批中'
        },
        {
          id: 2,
          name: '审批通过'
        },
        {
          id: 3,
          name: '已下发'
        },
        {
          id: 4,
          name: '已确认'
        },
        {
          id: 5,
          name: '分坯中'
        },
        {
          id: 6,
          name: '生产中'
        },
        {
          id: 7,
          name: '完工'
        }],
      tableHeight: window.innerHeight - 245,
      total: 0,
      multipleSelection: [],
      orderTranction: false,
      orderSourceLoading: true,
      orderSourceList: [],
      tableData: [],
      productionOrderForm: {
        orderNo: undefined,
        SalesmanName: undefined,
        dateStart: undefined,
        dateEnd: undefined,
        clientName: undefined,
        SalesGroupIds: undefined,
        revised: undefined,
        page: 1,
        limit: 10
      },
      rules: {
        orderNo: [
          // { required: true, message: '请输入合同编号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        clientName: [
          // { required: true, message: '请输入合金牌号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        dateStart: [
          { type: 'date', message: '请选择日期', trigger: 'change' }
        ],
        dateEnd: [
          { type: 'date', message: '请选择时间', trigger: 'change' }
        ]
      },
      cols: [
        {
          props: 'processState',
          label: '订单状态',
          fixed: true
        },
        {
          props: 'creationTime',
          label: '制单日期',
          width: '150px',
          align: 'center'
        },
        {
          props: 'orderNo',
          label: '合同编号',
          width: '120px'
        },
        {
          props: 'quantity',
          label: '数量',
          width: '100px'
        },
        {
          props: 'salesmanName',
          label: '业务员',
          width: '100px'
        },
        {
          props: 'clientName',
          label: '销售客户',
          width: '200px'
        },
        {
          props: 'salesGroupName',
          label: '订单来源'
        },
        {
          props: 'creatorUserName',
          label: '制单人',
          width: '80px'
        },
        {
          props: 'processNote',
          label: '技术要求',
          width: '250px'
        },
        {
          props: 'packingNote',
          label: '包装要求',
          width: '250px'
        },
        {
          props: 'pecialNote',
          label: '特殊要求',
          width: '250px'
        },
        {
          props: 'region',
          label: '到货地点',
          width: '250px'
        }]
    }
  },
  watch: {
    fullHeight(val) {
      if (!this.tableHeight) {
        this.tableHeight = val
      }
    }
  },
  mounted() {
    this.orderSourceInit()
    this.query()
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight
        this.tableHeight = window.fullHeight - 245
      })()
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.state === 1) {
        return 'close-row'
      } else if (row.revised) {
        return 'waring-row'
      }
      return ''
    },
    orderSourceInit() {
      getOrderSourceList().then(response => {
        // console.log(response)
        this.orderSourceList = response.result
        this.orderSourceLoading = false
      })
    },
    dispatchChange(val) {
      this.orderTranction = val
      this.query(this.productionOrderForm)
    },
    revisedChange(val) {
      this.productionOrderForm.revised = val
      this.query(this.productionOrderForm)
    },
    handleBranchFactoryChange(val, row) {
      console.log(val)
      row.showFlag = false
      row.factoryName = val.name
      row.factoryId = val.id
    },
    clickRow(row) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].showFlag && this.tableData[i].id !== row.id) {
          this.tableData[i].showFlag = false
        }
      }
      this.$refs.orderTable.toggleRowSelection(row)
    },
    confirmDispatchTask() {
      if (this.multipleSelection.length < 1) {
        this.$notify({
          title: '请至少选择一个',
          type: 'warning'
        })
      }
      const data = []
      const temp = this.multipleSelection
      for (let i = 0; i < temp.length; i++) {
        data.push({
          id: temp[i].id,
          factoryId: temp[i].factoryId
        })
      }
    },
    orderTranctionTask() {
      if (this.multipleSelection.length < 1) {
        this.$notify({
          title: '请至少选择一个',
          type: 'warning'
        })
      }
      const data = []
      const temp = this.multipleSelection
      for (let i = 0; i < temp.length; i++) {
        data.push({
          id: temp[i].id,
          factoryId: temp[i].factoryId
        })
      }
    },
    query() {
      console.log(this.productionOrderForm)
      this.$refs.productionOrderForm.validate((valid) => {
        if (valid) {
          queryProductionOrder(this.productionOrderForm).then(response => {
            // console.log(response)
            this.tableData = response.result.items
            this.total = Number(response.result.totalCount)
          })
        } else {
          return false
        }
      })
    },
    changeBranchFactory() {
      if (this.multipleSelection.length < 1) {
        this.$notify({
          title: '请至少选择一条',
          type: 'warning'
        })
        return
      }
      if (this.branchFactory === undefined || this.branchFactory.id === '') {
        this.$notify({
          title: '请选择下发分厂',
          type: 'warning'
        })
        return
      }
      console.log(this.branchFactory)
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.multipleSelection[i].factoryName = this.branchFactory.name
        this.multipleSelection[i].factoryId = this.branchFactory.id
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
  /deep/ .factory-header {
    padding: 5px 10px 10px 5px;
    background: rgba(228,228,228,0.3);
  }
  /deep/ .search-form {
    min-width: 1250px;
    max-width: 1400px;
  }
  .el-row-style /deep/ .el-col{
    height: 40px;
  }
  /deep/ .close-row {
    color: #F56C6C;
  }
  /deep/ .waring-row {
    color: #E6A23C;
  }
</style>
