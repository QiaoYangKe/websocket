<template>
  <el-form ref="sendForm" :model="sendForm" status-icon label-width="120px" class="demo-ruleForm" size="mini">
    <el-row>
      <el-tag>
        当前用户id: {{ currentUserId }}
      </el-tag>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item label="发给全部的人" prop="allMessage">
          <el-input v-model="sendForm.allMessage" type="text" autocomplete="off" />
        </el-form-item>
      </el-col>
      <el-col :span="1">
        &nbsp;
      </el-col>
      <el-col :span="1">
        <el-button type="primary" icon="el-icon-check" circle size="mini" @click="sendMessage" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item label="发给指定的人" prop="allMessage">
          <el-input v-model="sendForm.personMessage" type="text" autocomplete="off" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="请选择" prop="userId">
          <el-select
            v-model="sendForm.userId"
            size="mini"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" icon="el-icon-check" circle size="mini" @click="sendMessageForPerson" />
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getUserId } from '@/utils/auth'
const signalR = require('@aspnet/signalr')
export default {
  name: 'NetSocket',
  data() {
    return {
      currentUserId: '',
      sendForm: {
        allMessage: '',
        personMessage: '',
        userId: ''
      },
      client: {
        connetcionId: '',
        ipAddress: '',
        tenantId: '',
        userId: '',
        connectTime: ''
      },
      userList: [{
        id: 1,
        name: 'admin'
      }, {
        id: 8,
        name: 'test'
      }, {
        id: 10,
        name: 'test2'
      }],
      connection: null
    }
  },
  async created() {
    await this.setupConnection()
  },
  mounted() {
    this.currentUserId = getUserId()
  },
  beforeDestroy() {
    this.connection.invoke('LoginOutSignalr', getUserId()).then(function(data) {})
  },
  methods: {
    async sendMessage() {
      var $this = this
      const list = []
      await this.connection.invoke('ClientNote').then(function(data) {
        $this.client = data
        const clientId = $this.client.connectionId
        list.push(clientId)
        console.log(list)
      })
      $this.connection.invoke('SendMessage', this.sendForm.allMessage, list).then(function(data) {
      })
    },
    sendMessageForPerson() {
      if (this.sendForm.userId === '' || this.sendForm.personMessage === '') {
        this.$notify({
          title: '发送的信息为空或者没有选择接收人',
          type: 'warning'
        })
        return
      }
      this.connection.invoke('SendToUser', this.sendForm.userId, this.sendForm.personMessage).then(function(data) {
      })
    },
    async setupConnection() {
      this.connection = new signalR.HubConnectionBuilder().withUrl('http://10.1.10.49:21021/signalr').configureLogging(signalR.LogLevel.Information).build()
      this.connection.on('ReceiveMessage', (message) => {
        this.$notify({
          title: message,
          type: 'info'
        })
        this.mes = this.mes + message
      })
      await this.connection.start().catch(error => console.error(error.toString()))
      this.connection.invoke('LoginSignalr', this.currentUserId).then(function(data) {
      })
    }
  }
}
</script>

<style scoped>

</style>
