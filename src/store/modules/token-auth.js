import { authenticate } from '@/api/token-auth'
import { getAccessToken, setAccessToken, removeAccessToken,
  getEncryptedAccessToken, setEncryptedAccessToken, removeEncryptedAccessToken,
  getExpireInSeconds, setExpireInSeconds, removeExpireInSeconds,
  getUserId, setUserId, removeUserId } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  accessToken: getAccessToken(),
  encryptedAccessToken: getEncryptedAccessToken(),
  expireInSeconds: getExpireInSeconds(),
  userId: getUserId
}

const mutations = {
  SET_ACCESS_TOKEN: (state, accessToken) => {
    state.accessToken = accessToken
  },
  SET_ENCRYPTED_ACCESS_TOKEN: (state, encryptedAccessToken) => {
    state.encryptedAccessToken = encryptedAccessToken
  },
  SET_EXPIRE_IN_SECONDS: (state, expireInSeconds) => {
    state.expireInSeconds = expireInSeconds
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  }
}

const actions = {
  authenticate({ commit }, data) {
    const { userNameOrEmailAddress, password, rememberClient } = data
    return new Promise((resolve, reject) => {
      authenticate({
        userNameOrEmailAddress: userNameOrEmailAddress.trim(),
        password: password,
        rememberClient: rememberClient
      }).then(response => {
        const { result } = response
        commit('SET_ACCESS_TOKEN', result.accessToken)
        commit('SET_ENCRYPTED_ACCESS_TOKEN', result.encryptedAccessToken)
        commit('SET_EXPIRE_IN_SECONDS', result.expireInSeconds)
        commit('SET_USER_ID', result.userId)

        setAccessToken(result.accessToken)
        setEncryptedAccessToken(result.encryptedAccessToken)
        setExpireInSeconds(result.expireInSeconds)
        setUserId(result.userId)

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  logout({ commit }) {
    return new Promise((resolve) => {
      commit('SET_ACCESS_TOKEN', undefined)
      commit('SET_ENCRYPTED_ACCESS_TOKEN', undefined)
      commit('SET_EXPIRE_IN_SECONDS', undefined)
      commit('SET_USER_ID', undefined)

      removeAccessToken()
      removeEncryptedAccessToken()
      removeExpireInSeconds()
      removeUserId()

      resetRouter()
      resolve()
    })
  },

  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_ACCESS_TOKEN', undefined)
      commit('SET_ENCRYPTED_ACCESS_TOKEN', undefined)
      commit('SET_EXPIRE_IN_SECONDS', undefined)
      commit('SET_USER_ID', undefined)

      removeAccessToken()
      removeEncryptedAccessToken()
      removeExpireInSeconds()
      removeUserId()

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
