import { getCurrentLoginInformations } from '@/api/session'

const state = {
  user: undefined,
  tenant: undefined,
  application: undefined
}

const mutations = {
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_TENANT: (state, tenant) => {
    state.tenant = tenant
  },
  SET_APPLICATION: (state, application) => {
    state.application = application
  }
}

const actions = {
  getCurrentLoginInformations({ commit }) {
    return new Promise((resolve, reject) => {
      getCurrentLoginInformations().then(response => {
        const { result } = response
        if (!result) {
          reject('Verification failed, please Login again.')
        }

        const { user, tenant, application } = result
        commit('SET_USER', user)
        commit('SET_TENANT', tenant)
        commit('SET_APPLICATION', application)

        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
