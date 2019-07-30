<template>
  <el-container class="outer-container">
    <el-aside width="200px" class="workcenter-area">
      <el-select
        v-model="workCenter"
        :loading="workCenterListLoading"
        loading-text="加载中..."
        placeholder="工作中心"
        class="workcenter-select"
        @change="handleWorkCenterChange"
      >
        <el-option
          v-for="item in workCenterList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <!-- <draggable class="equipment-list-area" :move="handleEquipmentMove">
        <div v-for="equipment in WorkCenterEquipmentList" :key="equipment.id" class="equipment-item">
          {{ equipment.name }}
        </div>
      </draggable> -->

      <draggable
        v-model="WorkCenterEquipmentList"
        v-bind="equipmentDragOptions"
        class="list-group"
        tag="ul"
      >
        <transition-group type="transition">
          <li
            v-for="equipment in WorkCenterEquipmentList"
            :key="equipment.id"
            class="list-group-item"
          >
            {{ equipment.name }}
            <span class="badge">{{ equipment.currentBatchCount }}</span>
          </li>
        </transition-group>
      </draggable>

    </el-aside>
    <el-main class="outer-main">
      <split-pane split="horizontal">
        <template slot="paneL">
          <div class="top-container" />
        </template>
        <template slot="paneR">
          <div class="bottom-container" />
        </template>
      </split-pane>
    </el-main>
  </el-container>
</template>

<script>
import draggable from 'vuedraggable'
import splitPane from 'vue-splitpane'
import { getWorkCenters, getWorkCenterEquipments } from '@/api/equipment-management/work-center'

export default {
  name: 'FinishedProductDispatch',
  components: { draggable, splitPane },
  data() {
    return {
      workCenter: undefined,
      workCenterList: undefined,
      workCenterListLoading: true,
      WorkCenterEquipmentList: undefined
    }
  },
  computed: {
    equipmentDragOptions() {
      return {
        animation: 0,
        group: 'equipment',
        disabled: true,
        ghostClass: 'ghost'
      }
    }
  },
  created() {
    this.fetchWorkCenterList()
  },
  methods: {
    fetchWorkCenterList() {
      this.workCenterListLoading = true
      getWorkCenters().then(response => {
        this.workCenterList = response.result
        this.workCenterListLoading = false
      })
    },
    handleWorkCenterChange() {
      this.fetchWorkCenterEquipments()
    },
    fetchWorkCenterEquipments() {
      getWorkCenterEquipments({ workCenterId: this.workCenter }).then(response => {
        this.WorkCenterEquipmentList = response.result
      })
    },
    handleEquipmentMove({ relatedContext, draggedContext }) {
      console.log(relatedContext)
      console.log(draggedContext)
      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.outer-container {
  min-height: calc(100vh - 50px);
  background-color: #E9EEF3;
}

.workcenter-area {
  background-color: #D3DCE6;
  padding: 10px
}

.workcenter-select {
  width: 100%
}

.outer-main {
  padding: 0;
}

// .equipment-list-area{
//   margin-top: 30px;
// }

// .equipment-item{
//   width: 100%;
//   text-align: center;
//   line-height: 40px;
//   margin: 10px 0;
//   background-color: #FFFFFF;
//   border-radius: 3px
// }

.list-group {
  padding-left: 0;
  margin-bottom: 20px;
  min-height: 20px;
}

ul, ol {
  margin-top: 0;
  margin-bottom: 10px;
}

ul {
  display: block;
  list-style-type: disc;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 40px;
}

.list-group-item:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.list-group-item {
  position: relative;
  display: block;
  padding: 10px 15px;
  margin-bottom: -1px;
  background-color: #fff;
  border: 1px solid #ddd;
  cursor: move;
}

li {
  display: list-item;
  text-align: -webkit-match-parent;
}

.list-group-item i {
  cursor: pointer;
}

.list-group-item > .badge {
  float: right;
}

.badge {
  display: inline-block;
  min-width: 10px;
  padding: 3px 7px;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  background-color: #777;
  border-radius: 10px;
}

</style>
