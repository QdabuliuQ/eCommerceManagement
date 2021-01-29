import axios from "axios";    // 引入axios

export function request(config) {
  const instance = axios.create({
    // 根路径
    // baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
    baseURL: 'http://www.ysqorz.top:8888/api/private/v1/',
    // 请求时间
    timeout: 5000,
  })

  // 拦截请求
  // use方法传递两个函数
  // 拦截器在发送请求成功后，对该请求进行拦截，在发送请求就会输出 config
  // 通过 return 将拦截的内容返回，则不会触发 err
  instance.interceptors.request.use(config => {
    // api要求在对需要权限的所有api接口都要在请求头中添加 `Authorization` ：token
    config.headers.Authorization = window.sessionStorage.getItem("token")  // 将token放入请求头中
    return config
  })

  // 返回 实例对象
  return instance(config)

}

export function request2(config) {
  const instance = axios.create({
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
    timeout: 5000,
  })
  instance.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem("token")  // 将token放入请求头中
    return config
  })
  return instance(config)
}