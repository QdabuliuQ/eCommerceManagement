import {request} from "network/request"

// 获取角色列表
export function getRolesList() {
  return request({
    url: 'roles',
    method: 'get'
  })
}