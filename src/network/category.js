import {request} from "network/request"

// 获取商品数据
export function getGoodsCategory(type, pagenum, pagesize) {
  return request({
    url: 'categories',
    params: {
      type, 
      pagenum, 
      pagesize
    }
  })
}

// 添加分类信息
export function postAddCateDetail(cat_pid, cat_name, cat_level) {
  return request({
    url: 'categories',
    method: 'post',
    data: {
      cat_pid, 
      cat_name, 
      cat_level
    }
  })
}

// 编辑分类信息
export function EditCateDetail(id, cat_name) {
  return request({
    url: 'categories/' + id,
    method: 'put',
    data: {
      cat_name
    }
  })
}

// 删除分类信息
export function DeleteCateDetail(id) {
  return request({
    url: 'categories/' + id,
    method: 'delete'
  })
}