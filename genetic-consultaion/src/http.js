/**
 * Created by leamox on 2017/12/23.
 */

import axios from 'axios'
import qs from 'qs'

axios.defaults.baseURL = process.env.BASE_URL
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'

// http request 拦截器
axios.interceptors.request.use(
    config => {
        config.headers.Authorization = window.localStorage.token || ''
        config.params = config.params ? config.params : {}
        config.params.userId = window.localStorage.userId ? parseInt(window.localStorage.userId) : 0
        // if (config.method === 'post' || config.method === 'put') {
            // config.data = qs.stringify(config.data)
            // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        // }
        // if(!config.headers.Authorization) return false
        return config
    },
    err => {
        return Promise.reject(err)
    })
// production
const linkUrl =  process.env.NODE_ENV === 'production' ? 'https://z.mdhcare.cn/login.html':'https://qa.mdhcare.cn/website/login.html'
// const linkUrl =  'http://47.113.112.104:9101/login.html'
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 401:
                    window.localStorage.clear()
                    window.location.href = linkUrl
            }
        }else{
            window.location.href = linkUrl
        }
        return Promise.reject(error.response.data)
    })

export default axios
