// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import qs from 'qs'
import Antd from 'ant-design-vue'
import Common from './commons/Common.vue'
import 'ant-design-vue/dist/antd.css'
import './commons/css/frame.css'
import './commons/css/page.css'
import './commons/css/button.css'
import './commons/css/page-header.css'
import './commons/css/pagination.css'

Vue.use(Antd)

axios.defaults.baseURL = 'http://localhost:3331/api/'
// axios.defaults.baseURL = 'http://120.55.162.113:3331/api/'

// 前置拦截
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('eastoken')
  return config
})

Vue.prototype.$http = axios
Vue.prototype.$axios = axios
Vue.prototype.qs = qs

Vue.config.productionTip = false
Vue.prototype.Common = Common

Vue.prototype.$getBase64Image = img => {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  let ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
  if (ext === 'jpg') {
    ext = 'jpeg'
  }
  return canvas.toDataURL('image/' + ext)
}

// 服务器图片根目录
Vue.prototype.imageBaseUrl = 'http://120.55.162.113:82/'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
