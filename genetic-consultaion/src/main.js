// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from './http.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import vSelect from 'vue-select2'
import VCharts from 'v-charts'
import VueJsonp from 'vue-jsonp'

Vue.use(VueJsonp)
Vue.use(VCharts)

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

Vue.use(ElementUI)
Vue.config.productionTip = false
// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = axios
Vue.component('v-select', vSelect)

Vue.filter('formatDate', function (time) {
  if (!time) return ''
  let date = new Date(time)
  let fmt = 'yyyy-MM-dd hh:mm:ss'
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length))
    }
  }
  return fmt
})

// 初始化智齿咨询组件实例
/* global getzhiSDKInstance */
let zhiManager = (getzhiSDKInstance())
// 再调用load方法
zhiManager.on('load', function () {
  zhiManager.initBtnDOM()
})
// zhiManager.set('color','09aeb0'); //API示例，格式为 0-9 a-f 之间的六位有效字符 不用加#

zhiManager.set('color', 'E9AE47') // 格式为 0-9 a-f 之间的六位有效字符 不用加#
zhiManager.set('title', '联系我') // 建议长度为 8 个字符之内，文案仅对 PC组件有效，移动端没有文案
// 若传入 1 ，按钮将显示在右下角 默认显示在右下角
// 若传入 2 ，按钮将显示在左下角
zhiManager.set('location', 1)// 设置入口方位

zhiManager.set('horizontal', 0) // 设置水平边距，默认水平为 20 像素
zhiManager.set('vertical', 10) // 设置垂直边距，默认垂直为 40 像素
// 最小宽度360像素，最大宽度640像素，默认360像素
// 最小高度430像素，最大高度720像素，默认540像素
zhiManager.set('size', {
  'width': 260,
  'height': 440
})
// 设置为true ||不设置 则显示
// 设置为 false 则不显示
zhiManager.set('powered', false)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
