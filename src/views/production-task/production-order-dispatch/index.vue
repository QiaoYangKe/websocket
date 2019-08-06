<template>
  <el-container>
    <el-header class="factory-header" height="40px">
      <el-select
        v-model="branchFactory"
        size="mini"
        value-key="id"
        :loading="branchFactoryListLoading"
        loading-text="加载中..."
        placeholder="请选择分厂"
        class="factory-select"
      >
        <el-option
          v-for="item in branchFactoryList"
          :key="item.id"
          :label="item.name"
          :value="item"
        />
      </el-select>
      <el-button size="mini" type="primary" plain :disabled="orderTranction" @click="changeBranchFactory"><i class="el-icon-notebook-2" /> 批量更改</el-button>
      <el-button size="mini" type="primary" plain :disabled="orderTranction" @click="confirmDispatchTask"><i class="el-icon-check" /> 确认下发</el-button>
      <el-button size="mini" type="primary" plain :disabled="!orderTranction" @click="orderTranctionTask"><i class="el-icon-edit" /> 订单转移</el-button>
      <div class="status-style-class">
        标识：<el-button size="mini" style="background: #F56C6C">关闭</el-button><el-button size="mini" style="background: #E6A23C">更改</el-button>
      </div>
    </el-header>
    <el-main>
      <el-form ref="ruleForm" size="mini" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm search-form">
        <el-row :gutter="10" style="width: 100%" class="el-row-style">
          <el-col :span="10">
            <el-form-item label="订单日期" required>
              <el-col :span="11">
                <el-form-item prop="dateStart">
                  <el-date-picker v-model="ruleForm.dateStart" type="date" placeholder="开始日期" style="width: 100%;" />
                </el-form-item>
              </el-col>
              <el-col class="line" :span="1">-</el-col>
              <el-col :span="12">
                <el-form-item prop="dateEnd">
                  <el-date-picker v-model="ruleForm.dateEnd" placeholder="截止日期" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="合同编号" prop="orderNo">
              <el-input v-model="ruleForm.orderNo" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="下发分厂" prop="factory" style="margin-left: 50px">
              <el-select v-model="ruleForm.factory" clearable :loading="branchFactoryListLoading" placeholder="请选择下发分厂" loading-text="加载中..." @change="query()">
                <el-option
                  v-for="item in branchFactoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
            <el-form-item label="合金牌号" prop="alloyGrade">
              <el-input v-model="ruleForm.alloyGrade" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="订单来源" prop="orderSource" @change="query()">
              <el-select v-model="ruleForm.orderSource" clearable :loading="orderSourceLoading" placeholder="请选择订单来源" loading-text="加载中...">
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
            <el-form-item label="是否下发" prop="dispatch">
              <el-radio-group v-model="ruleForm.dispatch" @change="dispatchChange(ruleForm.dispatch)">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="是否确认" prop="confirm" @change="query()">
              <el-select v-model="ruleForm.confirm" clearable placeholder="请选择">
                <el-option label="是" :value="true" />
                <el-option label="否" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="orderTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
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
            <div v-if="item.props === 'branchFactoryDate' || item.props === 'dispatchDate'">
              {{ scope.row[item.props] | parseTime('{y}-{m}-{d} {h}:{i}:') }}
            </div>
            <div v-else-if="item.props === 'finishDate'">
              {{ scope.row[item.props] | parseTime('{y}-{m}-{d}') }}
            </div>
            <div v-else-if="item.props === 'confirm'">
              <span>{{ scope.row.confirm === 1 ? '是' : '否' }}</span>
            </div>
            <div v-else-if="item.props === 'dispatch'">
              <span>{{ scope.row.dispatch === 1 ? '是' : '否' }}</span>
            </div>
            <div v-else-if="item.props === 'factory'">
              <div v-if="!scope.row.showFlag" :id="'span_'+item.id" @click="changeToSelect(scope.row)">{{ scope.row[item.props] }}</div>
              <el-select
                v-else
                v-model="scope.row.factory"
                value-key="id"
                :loading="branchFactoryListLoading"
                loading-text="加载中..."
                placeholder="请选择分厂"
                @change="((val)=>{handleBranchFactoryChange(val, scope.row)})"
              >
                <el-option
                  v-for="th in branchFactoryList"
                  :key="th.id"
                  :label="th.name"
                  :value="th"
                />
              </el-select>
            </div>
            <div v-else>
              <span>{{ scope.row[item.props] }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination v-show="total>0" :total="total" :page.sync="ruleForm.page" :limit.sync="ruleForm.limit" @pagination="query" />
    </el-main>
  </el-container>
</template>

<script>
import { parseTime } from '@/utils'
import { getBranchFactoryList, confirmDispatch, getOrderSourceList, queryOrderList, orderTranction } from '@/api/production-task/production-order-dispatch'
import Pagination from '@/components/Pagination/index.vue'
export default {
  name: 'ProductionOrderDispatch',
  filters: {
    // 状态行
    // statusFilter(status) {
    //   const statusMap = {
    //     published: 'success',
    //     draft: 'info',
    //     deleted: 'danger'
    //   }
    //   return statusMap[status]
    // },
    parseTime
  },
  components: { Pagination },
  data() {
    return {
      branchFactory: {
        id: '',
        name: ''
      },
      branchFactoryList: undefined,
      total: 0,
      multipleSelection: [],
      orderTranction: false,
      branchFactoryListLoading: true,
      orderSourceLoading: true,
      orderSourceList: [],
      tableData: [],
      ruleForm: {
        orderNo: undefined,
        factory: undefined,
        dateStart: undefined,
        dateEnd: undefined,
        alloyGrade: undefined,
        orderSource: undefined,
        dispatch: undefined,
        confirm: undefined,
        page: 1,
        limit: 10
      },
      rules: {
        orderNo: [
          // { required: true, message: '请输入合同编号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        alloyGrade: [
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
          props: 'factory',
          label: '下发分厂',
          width: '120px',
          fixed: true
        },
        {
          props: 'deliveryOrganization',
          label: '发货组织',
          width: '120px'
        },
        {
          props: 'salesman',
          label: '业务员',
          width: '120px'
        },
        {
          props: 'production',
          label: '产品名称',
          width: '120px'
        },
        {
          props: 'orderNo',
          label: '合同编号',
          width: '120px'
        },
        {
          props: 'purpose',
          label: '用途'
        },
        {
          props: 'alloyGrade',
          label: '合金牌号'
        },
        {
          props: 'alloyTemper',
          label: '状态',
          width: '120px'
        },
        {
          props: 'specifications',
          label: '规格',
          width: '120px'
        },
        {
          props: 'number',
          label: '数量',
          width: '60px'
        },
        {
          props: 'slices',
          label: '片数',
          width: '60px'
        },
        {
          props: 'dispatch',
          label: '下发',
          width: '60px',
          align: 'center'
        },
        {
          props: 'destinationLocation',
          label: '目的港',
          width: '120px'
        },
        {
          props: 'dispatchDate',
          label: '下发时间',
          width: '120px'
        },
        {
          props: 'confirm',
          label: '确认',
          width: '60px',
          align: 'center'
        },
        {
          props: 'branchFactoryDate',
          label: '分厂确认时间',
          width: '120px'
        },
        {
          props: 'finishDate',
          label: '交货日期',
          width: '120px'
        }]
    }
  },
  mounted() {
    this.branchFactoryListInit()
    this.orderSourceInit()
    this.query(this.ruleForm)
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.status === 1) {
        return 'close-row'
      } else if (row.status === 2) {
        return 'waring-row'
      }
      return ''
    },
    branchFactoryListInit() {
      getBranchFactoryList().then(response => {
        this.branchFactoryList = response.result
        this.branchFactoryListLoading = false
      })
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
      this.query(this.ruleForm)
    },
    changeToSelect(row) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].showFlag && this.tableData[i].id !== row.id) {
          this.tableData[i].showFlag = false
        }
      }
      row.showFlag = true
    },
    handleBranchFactoryChange(val, row) {
      row.factoryId = val.id
      row.factory = val.name
      row.showFlag = false
    },
    clickRow(row) {
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
          id: temp.id,
          factoryId: temp.factoryId
        })
      }
      confirmDispatch(data).then(response => {
        this.$notify({
          title: '下发成功',
          type: 'success'
        })
      })
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
          id: temp.id,
          factoryId: temp.factoryId
        })
      }
      orderTranction(data).then(response => {
        this.$notify({
          title: '转移成功',
          type: 'success'
        })
      })
    },
    query() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          queryOrderList(this.ruleForm).then(response => {
            // console.log(response)
            this.tableData = response.result.rows
            this.total = response.result.total
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
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.multipleSelection[i].factory = this.branchFactory.name
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
  .status-style-class {
    float: right;
    line-height: 33px;
    text-align: center;
  }
</style>
