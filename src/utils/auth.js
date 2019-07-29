import Cookies from 'js-cookie'

const AccessTokenKey = 'almes_web_client_access_token'
const EncryptedAccessTokenKey = 'almes_web_client_encrypted_access_token'
const ExpireInSecondsKey = 'almes_web_client_expire_in_seconds'
const UserIdKey = 'almes_web_client_user_id'

export function getAccessToken() {
  return Cookies.get(AccessTokenKey)
}

export function setAccessToken(token) {
  return Cookies.set(AccessTokenKey, token)
}

export function removeAccessToken() {
  return Cookies.remove(AccessTokenKey)
}

export function getEncryptedAccessToken() {
  return Cookies.get(EncryptedAccessTokenKey)
}

export function setEncryptedAccessToken(token) {
  return Cookies.set(EncryptedAccessTokenKey, token)
}

export function removeEncryptedAccessToken() {
  return Cookies.remove(EncryptedAccessTokenKey)
}

export function getExpireInSeconds() {
  return Cookies.get(ExpireInSecondsKey)
}

export function setExpireInSeconds(seconds) {
  return Cookies.set(ExpireInSecondsKey, seconds)
}

export function removeExpireInSeconds() {
  return Cookies.remove(ExpireInSecondsKey)
}

export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function setUserId(id) {
  return Cookies.set(UserIdKey, id)
}

export function removeUserId() {
  return Cookies.remove(UserIdKey)
}
