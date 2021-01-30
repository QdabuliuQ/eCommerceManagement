<template>
  <div id="ReportView">
    <brand-crumb :crumbList="crumbList"></brand-crumb>
    <el-card class="box-card">
      <div ref="chart" style="width: 800px;height:400px;" class="mian"></div>
    </el-card>
  </div>
</template>

<script>
import BrandCrumb from "components/common/BrandCrumb";
import {getReportCharts} from "network/report"
import echarts from "echarts"
import _ from "lodash"

export default {
  name: 'ReportView',
  data () {
    return {
      crumbList: [],
      options: {  // 图表数据
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  // 页面渲染完成生命周期函数
  created() {
    this.crumbList = JSON.parse(window.sessionStorage.getItem("menuName")); // 获取储存数据
  },
  mounted () {
    var chartRef = this.$refs.chart
    if (chartRef) {
      var myChart = echarts.init(chartRef)
      getReportCharts().then(res => {
        if (res.data.meta.status == 200) {
          this.$message.success("获取报表数据成功！")
          const result = _.merge(res.data.data, this.options)
          myChart.setOption(result)
        } else {
          this.$message.success("获取报表数据失败")
        }
      })
    }
    
    

    // my
  },
  // 注册组件
  components: {
    BrandCrumb,
  },
}

</script>
<style scoped>
.box-card{
  margin-top: 20px;
  /* background-color: #47474759; */
}
</style>