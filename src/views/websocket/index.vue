<template>
  <div>
    <button @click="send">发消息</button>
  </div>
</template>

<script>
// import { test } from '../../api/session'
// import * as Mock from 'mockjs'

export default {
  data() {
    return {
      websocket: null
    }
  },
  destroyed() {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  created() {
    // test().then(function(data) {
    //   console.log(data)
    // })
    // this.initWebSocket()
  },
  methods: {
    // 在方法里调用 this.websocketsend()发送数据给服务器
    onConfirm() {
      // 需要传输的数据
      const data = {
        code: 1,
        item: '传输的数据'
      }
      this.websocketsend(JSON.stringify(data))
    },
    send() {
      const data = {
        code: 0,
        msg: '这是client：初次连接'
      }
      this.websocketsend(JSON.stringify(data))
    },
    initWebSocket() { // 初始化weosocket
      const i = new Date().getTime()
      const baseURL = '10.1.10.49:8888'
      this.websock = new WebSocket('ws://' + baseURL + '/websocket/' + i)
      // this.websocket = new WebSocket('ws://10.1.10.49:21021/')
      this.websock.onmessage = this.websocketonmessage
      this.websock.onerror = this.websocketonerror
      this.websock.onopen = this.websocketonopen
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() { // 连接建立之后执行send方法发送数据
      this.websock.send('aaa')
    },
    websocketonerror() {
      console.log('WebSocket连接失败')
    },
    websocketonmessage(e) { // 数据接收
      console.log('数据接收' + e.data)
      this.$notify({
        title: '提醒',
        message: e.data
      })
    },
    websocketsend(Data) { // 数据发送
      this.websock.send(Data)
    },
    websocketclose(e) {
      console.log('已关闭连接', e)
    }
  }
}
</script>

<style>

</style>
