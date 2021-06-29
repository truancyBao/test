import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    userInfo: JSON.parse(sessionStorage.getItem('userInfo')),
    identity: ''
  },
  mutations: {
    // set
    SET_TOKEN: (state, token) => {
      state.token = token
      sessionStorage.setItem('token', token)
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    SET_IDENTITY: (state, identity) => {
      state.identity = identity
      sessionStorage.setItem('identity', identity)
    },
    REMOVE_INFO: state => {
      state.token = ''
      state.userInfo = {}
      state.identity = ''
      sessionStorage.setItem('token', '')
      sessionStorage.setItem('userInfo', JSON.stringify(''))
      sessionStorage.setItem('identity', '')
    }
  },
  getters: {
    getUser: state => {
      return state.userInfo
    }
  },
  actions: {},
  modules: {}
})
