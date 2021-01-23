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

// 修改用户权限
export function setUserPower(roleId, rids) {
  return request({
    url: 'roles/'+roleId+'/rights',
    data: {
      rids
    },
    method: 'post'
  })
}

// 保存用户角色
export function setUserRole(id, rid) {
  return request({
    url: 'users/'+id+'/role',
    method: 'put',
    data: {
      rid
    }
  })
}

// 添加角色
export function addRoleInformation(roleName, roleDesc) {
  return request({
    url: 'roles',
    data: {
      roleName, 
      roleDesc
    },
    method: 'post'
  })
}

// 删除角色
export function deleteRoleInformation(id) {
  return request({
    url: 'roles/' + id,
    method: 'delete'
  })
}

// 编辑角色
export function settingRoleInformation(id, roleName, roleDesc=null) {
  return request({
    url: 'roles/' + id,
    data: {
      roleName, 
      roleDesc
    },
    method: 'put'
  })
}