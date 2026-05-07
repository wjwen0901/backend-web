/**
 * Created by leamox on 2017/12/23.
 */

import axios from 'axios'
import forge from 'node-forge'

axios.defaults.baseURL = process.env.BASE_URL
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'

const isDev = process.env.NODE_ENV === 'development'
const devLoginClient = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 8000
})
let devAuthPromise = null

function setDevAuthItem (key, value) {
  if (value !== undefined && value !== '') {
    window.localStorage.setItem(key, value)
  }
}

function syncConfiguredDevAuth () {
  if (!isDev || !process.env.DEV_AUTH_TOKEN) {
    return false
  }

  setDevAuthItem('token', process.env.DEV_AUTH_TOKEN)
  setDevAuthItem('userId', process.env.DEV_AUTH_USER_ID || '1')
  setDevAuthItem('role', process.env.DEV_AUTH_ROLE || 'manager')
  setDevAuthItem('fullName', process.env.DEV_AUTH_FULL_NAME || 'admin')
  setDevAuthItem('username', process.env.DEV_AUTH_USERNAME || process.env.DEV_AUTH_FULL_NAME || 'admin')
  setDevAuthItem('devAuthSource', 'configured-token')
  return true
}

function canDevAutoLogin () {
  return isDev &&
    process.env.DEV_AUTH_AUTO_LOGIN === 'true' &&
    process.env.DEV_AUTH_LOGIN_NAME &&
    process.env.DEV_AUTH_LOGIN_PASSWORD
}

function reverseString (value) {
  return value.split('').reverse().join('')
}

function encryptDevPassword (publicKey, password) {
  const rsaKey = forge.pki.setRsaPublicKey(
    new forge.jsbn.BigInteger(publicKey.modulus, 16),
    new forge.jsbn.BigInteger(publicKey.exponent, 16)
  )
  const encrypted = rsaKey.encrypt(reverseString(password), 'RSAES-PKCS1-V1_5')
  return forge.util.bytesToHex(encrypted)
}

function persistDevLogin (data) {
  const user = data.user || {}

  setDevAuthItem('token', data.token)
  setDevAuthItem('userId', user.id || process.env.DEV_AUTH_USER_ID || '1')
  setDevAuthItem('role', data.role || process.env.DEV_AUTH_ROLE || 'manager')
  setDevAuthItem('sec', data.sec)
  setDevAuthItem('fullName', user.fullName || process.env.DEV_AUTH_FULL_NAME || process.env.DEV_AUTH_LOGIN_NAME)
  setDevAuthItem('username', user.username || process.env.DEV_AUTH_LOGIN_NAME)
  setDevAuthItem('devAuthSource', 'auto-login')
}

function requestDevLogin () {
  if (devAuthPromise) return devAuthPromise

  devAuthPromise = devLoginClient.get('publickey', {
    params: { id: process.env.DEV_AUTH_PUBLIC_KEY_ID || 'dev-auto-login' }
  }).then(res => {
    const publicKey = res.data || {}
    const form = new URLSearchParams()
    form.set('name', process.env.DEV_AUTH_LOGIN_NAME)
    form.set('pwd', encryptDevPassword(publicKey, process.env.DEV_AUTH_LOGIN_PASSWORD))
    form.set('publicKey.modulus', publicKey.modulus)
    form.set('publicKey.exponent', publicKey.exponent)

    return devLoginClient.post('login', form.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
    })
  }).then(res => {
    persistDevLogin(res.data || {})
  }).catch(error => {
    devAuthPromise = null
    if (syncConfiguredDevAuth()) return
    return Promise.reject(error)
  })

  return devAuthPromise
}

function ensureDevAuth (forceLogin) {
  if (!isDev) return Promise.resolve()
  if (forceLogin) devAuthPromise = null
  if (canDevAutoLogin()) {
    if (forceLogin || !window.localStorage.token || window.localStorage.devAuthSource !== 'auto-login') {
      return requestDevLogin()
    }
    return Promise.resolve()
  }
  syncConfiguredDevAuth()
  return Promise.resolve()
}

ensureDevAuth()

// http request 拦截器
axios.interceptors.request.use(
  config => {
    return ensureDevAuth().then(() => {
      config.headers.Authorization = window.localStorage.token || ''
      config.params = config.params ? config.params : {}
      config.params.userId = window.localStorage.userId ? parseInt(window.localStorage.userId) : 0
      // if(!config.headers.Authorization) return false
      return config
    })
  },
  err => {
    return Promise.reject(err)
  })
const linkUrl = process.env.NODE_ENV === 'production' ? 'https://z.mdhcare.cn/login.html' : process.env.DEV_LOGIN_PATH
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 401:
          if (isDev) {
            if (error.config && !error.config.__devAuthRetried) {
              error.config.__devAuthRetried = true
              return ensureDevAuth(true).then(() => axios(error.config))
            }
            return Promise.reject(error.response.data)
          }
          window.localStorage.clear()
          if (!isDev && linkUrl) {
            window.location.href = linkUrl
          }
      }
    } else {
      if (!isDev && linkUrl) {
        window.location.href = linkUrl
      }
    }
    return Promise.reject(error.response ? error.response.data : error)
  })

export default axios
