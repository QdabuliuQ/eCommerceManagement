import {request} from "network/request"

// 获取权限列表
export function getPowerList(type) {
  return request({
    url: 'rights/' + type,
    method: 'get'
  })
}