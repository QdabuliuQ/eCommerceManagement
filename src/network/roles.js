import {request} from "network/request"

// 获取角色列表
export function getRolesList() {
  return request({
    url: 'roles',
    method: 'get'
  })
}

// 删除用户权限
export function deleteUserPower(roleId, rightId) {
  return request({
    url: 'roles/'+roleId+'/rights/'+rightId,
    method: 'delete'
  })
}