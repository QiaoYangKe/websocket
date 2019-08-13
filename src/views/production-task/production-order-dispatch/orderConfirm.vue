<template>
  <el-container>
    <el-header class="factory-header" style="min-width: 1250px;" height="40px">
      <el-button size="mini" type="primary" plain @click="confirmOrderTask"><i class="el-icon-check">&nbsp;</i> 确认订单</el-button>
      <el-button size="mini" type="primary" plain @click="exitOrderTask"><i class="el-icon-close">&nbsp;</i> 退回订单</el-button>
      <div class="status-style-class">
        标识：<el-button size="mini" style="background: #F56C6C">关闭</el-button><el-button size="mini" style="background: #E6A23C">更改</el-button>
      </div>
    </el-header>
    <el-main style="overflow: hidden">
      <el-form ref="orderConfirmRuleForm" size="mini" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm search-form">
        <el-row :gutter="10" style="width: 100%" class="el-row-style">
          <el-col :span="9">
            <el-form-item label="制单日期" required>
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
          <el-col :span="5">
            <el-form-item label="是否确认" prop="confirm">
              <el-radio-group v-model="ruleForm.confirm" @change="query">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" @click="query()">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-form-item>
              <el-button @click="resetForm()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="orderConfirmTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        :height="tableHeight"
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
              {{ scope.row[item.props] | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </div>
            <div v-else-if="item.props === 'deliveryDate'">
              {{ scope.row[item.props] | parseTime('{y}-{m}-{d}') }}
            </div>
            <div v-else-if="item.props === 'specifications'">
              <span>{{ scope.row.length }}*{{ scope.row.width }}*{{ scope.row.thick }}</span>
            </div>
            <div v-else-if="item.props === 'confirm'">
              <span>{{ scope.row.confirm ? '是' : '否' }}</span>
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
import { confirmOrder, exitOrder, queryOrderResult } from '@/api/production-task/order-confirm'
import Pagination from '@/components/Pagination/index.vue'
export default {
  name: 'OrderConfirm',
  filters: {
    parseTime
  },
  components: { Pagination },
  data() {
    return {
      total: 0,
      tableHeight: window.fullHeight - 205,
      multipleSelection: [],
      tableData: [],
      ruleForm: {
        orderNo: undefined,
        dateStart: undefined,
        dateEnd: undefined,
        confirm: false,
        page: 1,
        limit: 10
      },
      cols: [
        {
          props: 'confirm',
          label: '确认',
          width: '60px',
          align: 'center',
          fixed: true
        },
        {
          props: 'orderOrderNo',
          label: '合同编号',
          width: '120px'
        },
        {
          props: 'changeReason',
          label: '变更理由',
          width: '150px'
        },
        {
          props: 'orderSalesmanName',
          label: '业务员',
          width: '80px'
        },
        {
          props: 'factoryName',
          label: '下发分厂',
          width: '120px',
          fixed: true
        },
        {
          props: 'dispatchDate',
          label: '下发时间',
          width: '150px',
          align: 'center'
        },
        {
          props: 'branchFactoryDate',
          label: '确认时间',
          width: '150px',
          align: 'center'
        },

        {
          props: 'productName',
          label: '产品名称',
          width: '120px'
        },
        {
          props: 'useName',
          label: '用途'
        },
        {
          props: 'alloyGradeName',
          label: '合金牌号'
        },
        {
          props: 'alloyTemperName',
          label: '合金状态'
        },
        {
          props: 'specifications',
          label: '规格',
          width: '120px',
          align: 'center'
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
          props: 'deliveryDate',
          label: '交货日期',
          width: '120px',
          align: 'center'
        },
        {
          props: 'note',
          label: '备注',
          width: '120px'
        },
        {
          props: 'updateVersion',
          label: '修订版本',
          width: '120px'
        },
        {
          props: 'toleranceNote',
          label: '入库容差',
          width: '100px'
        },
        {
          props: 'thickLower',
          label: '厚差下',
          width: '70px',
          align: 'center'
        },
        {
          props: 'thickUpper',
          label: '厚差上',
          width: '70px',
          align: 'center'
        },
        {
          props: 'widthLower',
          label: '宽差下',
          width: '70px',
          align: 'center'
        },
        {
          props: 'widthUpper',
          label: '宽差上',
          width: '70px',
          align: 'center'
        },
        {
          props: 'lengthLower',
          label: '长差下',
          width: '70px',
          align: 'center'
        },
        {
          props: 'lengthUpper',
          label: '长差上',
          width: '70px',
          align: 'center'
        }],
      rules: {
        orderNo: [
          // { required: true, message: '请输入合同编号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        dateStart: [
          { type: 'date', message: '请选择日期', trigger: 'change' }
        ],
        dateEnd: [
          { type: 'date', message: '请选择时间', trigger: 'change' }
        ]
      }
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
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight
        this.tableHeight = window.fullHeight - 205
      })()
    }
    this.query()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.state === 1) {
        return 'close-row'
      } else if (row.orderRevised) {
        return 'waring-row'
      }
      return ''
    },
    clickRow(row) {
      this.$refs.orderConfirmTable.toggleRowSelection(row)
    },
    confirmOrderTask() {
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
      confirmOrder(data).then(response => {
        this.$notify({
          title: '确认成功',
          type: 'success'
        })
        this.query()
      })
    },
    exitOrderTask() {
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
          id: temp[i].id
        })
      }
      exitOrder(data).then(response => {
        this.$notify({
          title: '退回成功',
          type: 'success'
        })
        this.query()
      })
    },
    query() {
      this.$refs.orderConfirmRuleForm.validate((valid) => {
        if (valid) {
          queryOrderResult(this.ruleForm).then(response => {
            // console.log(response)
            this.tableData = response.result.items
            this.total = response.result.totalCount
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.orderConfirmRuleForm.resetFields()
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
      console.log(val)
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
  /deep/ .factory-header {
    padding: 5px 10px 10px 20px;
    background: rgba(228,228,228,0.3);
  }
  /deep/ .search-form {
    min-width: 1250px;
    max-width: 1400px;
    overflow: hidden;
  }
  /deep/ .close-row {
    color: #F56C6C;
  }
  /deep/ .waring-row {
    color: #E6A23C;
  }
 .el-row-style /deep/ .el-col{
    height: 40px;
  }
.status-style-class {
  float: right;
  margin-right: 25px;
  line-height: 33px;
  text-align: center;
}
</style>
