<template>
  <div id="BrandCrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="firstItem">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in crumbList" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    // 菜单项
    crumbList: {
      type: Array,
      default: () => ["用户管理","用户列表"]
    }
  },
  name: 'BrandCrumb'
}

</script>
<style scoped>
.firstItem{
  font-weight: 550;
}
</style>