<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>
  /* 引入字体图标 */
  /* @import "assets/css/iconfont.css";     */
  #app{
    width: 100vw;
    overflow-x: hidden;
    height: 100vh;
    min-width: 1366px;
  }
  .el-alert__content{
    display: flex  !important;
    align-items: center  !important;
  }
  .el-step__title{
    font-size: 13px !important;
  }
</style>
