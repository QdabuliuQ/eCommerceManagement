import {request} from "network/request"

// 获取商品数据
export function getGoodsDate(query, pagenum, pagesize) {
  return request({
    url: 'goods',
    params: {
      query, 
      pagenum, 
      pagesize
    }
  })
}