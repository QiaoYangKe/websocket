<template>
  <el-container>
    <el-header class="factory-header">
      <el-select
        v-model="branchFactory"
        value-key="id"
        :loading="branchFactoryListLoading"
        loading-text="加载中..."
        placeholder="请选择分厂"
        class="factory-select"
        @change="handleBranchFactoryChange()"
      >
        <el-option
          v-for="item in branchFactoryList"
          :key="item.id"
          :label="item.name"
          :value="item"
        />
      </el-select>
      <el-button @click="changeBranchFactory">批量更改</el-button>
      <el-button @click="comfirmBranchFactory">确认下发</el-button>
      <el-button @click="comfirmBranchFactory">订单转移</el-button>
    </el-header>
    <el-main>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="8">
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
          <el-col :span="4">
            <el-form-item label="合同编号" prop="orderNo">
              <el-input v-model="ruleForm.orderNo" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="下发分厂" prop="factory">
              <el-select v-model="ruleForm.factory" :loading="branchFactoryListLoading" placeholder="请选择下发分厂" loading-text="加载中..." @change="query('ruleForm')">
                <el-option
                  v-for="item in branchFactoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" @click="query('ruleForm')">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="4">
            <el-form-item label="合金牌号" prop="alloyGrade">
              <el-input v-model="ruleForm.alloyGrade" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="订单来源" prop="orderSource" @change="query('ruleForm')">
              <el-select v-model="ruleForm.orderSource" :loading="orderSourceLoading" placeholder="请选择订单来源" loading-text="加载中...">
                <el-option
                  v-for="item in orderSourceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="是否下发" prop="dispatch">
              <el-radio-group v-model="ruleForm.dispatch" @change="query('ruleForm')">
                <el-radio label="是" :value="true" />
                <el-radio label="否" :value="false" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="是否确认" prop="comfirm" @change="query('ruleForm')">
              <el-select v-model="ruleForm.comfirm" clearable placeholder="请选择">
                <el-option label="是" :value="true" />
                <el-option label="否" :value="false" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
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
        border
        @selection-change="handleSelectionChange"
        @row-click="clickRow"
      >
        <el-table-column
          type="selection"
          width="50"
        />
        <el-table-column
          v-for="item in cols"
          :key="item.props"
          :prop="item.props"
          :label="item.label"
          :width="item.width"
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
            <div v-else-if="item.props === 'factory'">
              <span :id="&quot;span_&quot;+scope.row.id" @click="changeToSelect(('span_'+scope.row.id), scope.row)">{{ scope.row[item.props] }}</span>
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
import { getBranchFactoryList, updateBranchFactoryList } from '@/api/production-task/production-order-dispatch'
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
      total: 12,
      multipleSelection: [],
      branchFactoryListLoading: true,
      orderSourceLoading: true,
      orderSourceList: [
        {
          id: 1,
          name: '订单来源1'
        }],
      tableData: [
        {
          id: 1,
          factory: 'aaa',
          deliveryOrganization: 'aaa',
          salesman: 'aa',
          production: 'aa',
          orderNo: 'a',
          purpose: 'a',
          alloyGrade: 'a',
          status: 'a',
          specifications: 'a',
          number: 2,
          slices: '',
          dispatch: '1',
          destinationLocation: 'a',
          dispatchDate: new Date(),
          comfirm: 'a',
          branchFactoryDate: new Date().getTime(),
          finishDate: new Date().getTime()
        }, {
          id: 2,
          factory: 'aaa',
          deliveryOrganization: 'aaa',
          salesman: 'aa',
          production: 'aa',
          orderNo: 'a',
          purpose: 'a',
          alloyGrade: 'a',
          status: 'a',
          specifications: 'a',
          number: 2,
          slices: '',
          dispatch: '1',
          destinationLocation: 'a',
          dispatchDate: new Date(),
          comfirm: 'a',
          branchFactoryDate: new Date().getTime(),
          finishDate: new Date().getTime()
        }],
      ruleForm: {
        orderNo: undefined,
        factory: undefined,
        dateStart: undefined,
        dateEnd: undefined,
        alloyGrade: undefined,
        orderSource: undefined,
        dispatch: undefined,
        comfirm: undefined,
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
          props: 'status',
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
          label: '数量'
        },
        {
          props: 'slices',
          label: '片数'
        },
        {
          props: 'dispatch',
          label: '下发'
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
          props: 'comfirm',
          label: '确认'
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
  },
  methods: {
    handleBranchFactoryChange() {
      // alert(this.branchFactory.name)
    },
    clickRow(row) {
      this.$refs.orderTable.toggleRowSelection(row)
    },
    comfirmBranchFactory() {
      if (this.multipleSelection.length < 1) {
        this.$notify({
          title: '请至少选择一个',
          type: 'warning'
        })
      }
      updateBranchFactoryList(this.multipleSelection).then(response => {
        this.$notify({
          title: '下发成功',
          type: 'success'
        })
      })
    },
    changeToSelect(str, row) {
      console.log(row)
      alert(str)
    },
    branchFactoryListInit() {
      getBranchFactoryList().then(response => {
        this.branchFactoryList = response.result
        console.log(response)
        this.branchFactoryListLoading = false
      })
    },
    query(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
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
      // console.log(val)
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>
/deep/ .factory-header {
  padding: 10px;
  background: lightgray;
}
.factory-select {}
</style>
