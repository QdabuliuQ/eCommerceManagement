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

//  添加商品
export function addGoodsDetail(formInfo) {
  return request({
    url: 'goods',
    data: formInfo, 
    method: 'POST'
  })
}

// 删除商品
export function deleteGoodsDetail(id) {
  return request({
    url: 'goods/' + id,
    method: 'delete'
  })
}

// 编辑商品
export function editGoodsDetail(id,goods_name,goods_price,goods_number,goods_weight,goods_introduce,pics,attrs, goods_cat) {
  return request({
    url: 'goods/' + id,
    data: {
      goods_name,
      goods_price,
      goods_number,
      goods_weight,
      goods_introduce,
      pics,
      attrs,
      goods_cat
    },
    method: 'put'
  })
}

// 查询商品信息
export function getGoodsDetail(id) {
  return request({
    url: 'goods/' + id
  })
}