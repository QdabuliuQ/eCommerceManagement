import {request} from "network/request"
import {request2} from "network/request"

// 获取订单数据
export function getOrderData(query, pagenum, pagesize) {
  return request({
    url: 'orders',
    params: {
      query, 
      pagenum, 
      pagesize
    }
  })
}

// 获取物流信息
export function getProgressData(id) {
  return request2({
    url: '/kuaidi/' + id,
  })
}

// 编辑订单信息
export function editOrderData(id,is_send,order_pay,order_price,order_number,pay_status) {
  return request({
    url: 'orders/' + id,
    method: 'put',
    data: {
      is_send,
      order_pay,
      order_price,
      order_number,
      pay_status
    }
  })
}