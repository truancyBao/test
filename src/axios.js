import axios from 'axios'
import router from './router'
import store from './store'
import Element from 'element-ui'

axios.defaults.baseURL = 'http://localhost:3331/api/'

axios.interceptors.response.use(
  response => {
    let res = response.data
    if (res.code === 200) {
      return response
    } else {
      Element.Message.error(res.msg, { duration: 3 * 1000 })
      return Promise.reject(response.data.msg)
    }
  },
  error => {
    if (error.response.data) {
      if (error.response.data.msg.length > 10) {
        error.message = '操作错误'
      } else {
        error.message = error.response.data.msg
      }
    } else {
      error.message = error.response.data.msg
    }

    if (error.response.status === 401) {
      store.commit('REMOVE_INFO')
      router.push('/')
    }

    Element.Message.error(error.message, { duration: 3 * 1000 })
    return Promise.reject(error)
  }
)
