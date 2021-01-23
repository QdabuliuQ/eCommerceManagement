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