import {request} from './request'

// 获取分类参数
export function getCateParams(id, sel) {
  return request({
    url: 'categories/'+id+'/attributes',
    params: {
      sel
    }
  })
}

// 添加参数/属性
export function addCateParams(id, attr_name, attr_sel) {
  return request({
    url: 'categories/'+id+'/attributes',
    data: {
      attr_name, 
      attr_sel
    },
    method: 'post'
  })
}

// 删除分类参数
export function deleteCateParams(id, attrid) {
  return request({
    url: 'categories/'+id+'/attributes/'+attrid,
    method: 'delete'
  })
}

// 添加属性tag
export function addCateParamsTag(id, attrId, attr_name, attr_sel, attr_vals) {
  return request({
    url: 'categories/'+id+'/attributes/'+attrId,
    data: {
      attr_name, 
      attr_sel, 
      attr_vals
    },
    method: 'put'
  })
}