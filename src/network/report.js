import {request} from "network/request"

// 获取图表数据
export function getReportCharts() {
  return request({
    url: 'reports/type/1'
  })
}