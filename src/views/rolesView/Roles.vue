<template>
  <div id="Roles">
    <brand-crumb :crumbList="crumbList"></brand-crumb>
    <el-card class="box-card">
      <el-button type="primary">添加角色</el-button>
      <el-table border :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" icon="el-icon-edit" type="primary">编辑</el-button>
            <el-button size="small" icon="el-icon-delete" type="danger">删除</el-button>
            <el-button size="small" icon="el-icon-setting" type="warning">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import BrandCrumb from "components/common/BrandCrumb";
import {getRolesList} from "network/roles"

export default {
  name: "Roles",
  data() {
    return {
      crumbList: [],
      tableData: [],  // 角色数据
    };
  },

  // 页面渲染完成生命周期函数
  created() {
    this.crumbList = JSON.parse(window.sessionStorage.getItem("menuName")); // 获取储存数据
    getRolesList().then(res => {
      console.log(res);
      this.tableData = res.data.data
    })
  },

  components: {
    BrandCrumb,
  },
};
</script>
<style scoped>
.box-card {
  margin-top: 20px;
}
.el-table{
  margin-top: 20px;
}
</style>