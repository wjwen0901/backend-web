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
        config.headers.Authorization = window.localStorage.token
        config.params = config.params ? config.params:{}
        config.params.userId = window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        if (config.method === 'post' || config.method === 'put') {
            // config.data = qs.stringify(config.data)
                // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        // if (store.state.token) {
        //
        // }
        return config
    },
    err => {
        return Promise.reject(err)
    })

axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 401 清除token信息并跳转到登录页面
                    window.localStorage.clear()
                    // wonder跳转登录
                    // window.location.href = 'https://z.mdhcare.cn/z/login.html'
                    window.location.href = 'https://z.mdhcare.cn/login.html'
            }
        }
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        return Promise.reject(error.response.data)
    })

export default axios
