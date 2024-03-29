import router from '../router';
import axios from 'axios'
import { useStore } from "vuex";
const store = useStore()
let url: any = import.meta.env // 配置不同环境的域名信息等
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // url = base url + request url
  timeout: 40 * 1000, // 默认用40s超时时间
  headers: { // 配置OAuth 2.0的认证头
    'Content-Type': 'application/json;charset=utf-8'
  },
  withCredentials: true // send cookies when cross-domain requests
})
// console.log(import.meta.env);


// 请求前置拦截器
service.interceptors.request.use((config) => {

  config.headers['token'] = sessionStorage.getItem('token')

  if (config.method === 'post' && !config.data) {
    config.data = config.params
    config.params = null
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 响应前置拦截器
service.interceptors.response.use((res) => {
  let errMsg = ''
  if (res.data.code=='401'){
    router.push("/login")
    errMsg = '权限校验错误'
    return Promise.reject(errMsg)
  }
  console.log(res,'res');
  return Promise.resolve(res)

}, (error) => {
  let errMsg = ''
  console.log(error,'error');

  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        errMsg = '错误的请求'
        break
      case 500:
        errMsg = '服务器端出错'
        break
      case 401:
        router.push("/login")
        errMsg = '权限校验错误'
        break
      default:
        errMsg = '网络错误'
    }
  }
  return Promise.reject(errMsg)
})

// 发起请求
export function request(config: any) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios({
        ...config
      })
      resolve(result)
    } catch (err) {
      reject(err)
    }
  })
}

export default service