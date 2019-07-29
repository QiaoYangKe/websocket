import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import tokenAuth from './modules/token-auth'
import session from './modules/session'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    tokenAuth,
    session
  },
  getters
})

export default store
