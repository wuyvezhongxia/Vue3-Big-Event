import axios from "axios";
import { useUserStore } from "@/stores"
import { ElMessage } from "element-plus"
import router from '@/router'
const baseURL = 'http://big-event-vue-api-t.itheima.net'
const instance = axios.create({
  baseURL,
  timeout: 5000,
//   headers: {'X-Custom-Header': 'foobar'}
})
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    const userStore = useUserStore()
    if(userStore.token){
      // 如果存在 token，则将其添加到请求头的 Authorization 字段中，以便在后端进行身份验证。
      config.headers.Authorization = userStore.token
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
// Add a response interceptor
instance.interceptors.response.use(function (res) {
    if(res.data.code === 0){
        return res
    }
    ElMessage({
        showClose: true,
        message: res.data.message||'服务异常',
        type: 'error',
    })
    return Promise.reject(res.data)
  }, function (err) {
    // console.log(err)
    ElMessage({
        showClose: true,
        message: err.response.data.message ||'服务异常',
        type: 'error',
    })
    console.log(err);
    // resolve special error
    if(err.response?.status === 401){
      router.push('/login')
    }
    return Promise.reject(err);
  })
  export default instance;
  export {baseURL}