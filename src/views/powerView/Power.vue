<template>
  <div id="Power">
    <brand-crumb :crumbList='crumbList'></brand-crumb>
    <el-card class="box-card">
      <el-table
        :data="tableData"
        stripe
        border
        fit
        style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="400"></el-table-column>
        <el-table-column prop="path" label="权限路径" width="400"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-else-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-else-if="scope.row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import BrandCrumb from "components/common/BrandCrumb"
import {getPowerList} from "network/power"

export default {
  name: 'Power',
  data () {
    return {
      crumbList: [],
      tableData: [],  // 表格数据
    }
  },

  // 页面渲染完成生命周期函数
  created () {
    this.crumbList = JSON.parse(window.sessionStorage.getItem("menuName"))   // 获取储存数据
    getPowerList("list").then(res => {
      console.log(res);
      this.tableData = res.data.data
    })
  },

  // 注册组件
  components: {
    BrandCrumb
  }
}

</script>
<style scoped>
.box-card{
  margin-top: 20px;
}
</style>