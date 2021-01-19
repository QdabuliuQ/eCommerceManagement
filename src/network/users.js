import {request} from "network/request"

// 获取管理员
export function getUsers(pagenum, pagesize, query) {
  return request({
    url: 'users',
    params: {
      pagenum, 
      pagesize, 
      query
    }
  })
}

// 设置用户状态
export function setUserState(uId, type) {
  return request({
    url: 'users/'+ uId +'/state/'+type,
    method: 'put'   // put 请求
  })
}

// 添加用户
export function addUserDetail(username, password, email, mobile) {
  return request({
    url: 'users',
    data: {
      username, 
      password, 
      email, 
      mobile
    },
    method: "post"
  })
}