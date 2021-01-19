<template>
  <el-container class="home-container">
    <!-- 顶部盒子 -->
    <el-header>
      <div class="header_logo_box">
        <div class="header_logo"><img src="~assets/image/logo.png" alt=""></div>
        <span>电商后台管理系统</span>
        <div style="clear:both"></div>
      </div>
      <div class="header_exit">
        <el-button @click="exitBtn" type="info">退出</el-button>
      </div>
    </el-header>
    <!-- 主体内容 -->
    <el-container>
      <!-- 左侧导航 -->
      <el-aside :width="showMenu ? '230px' : '64px'">
        <div @click="toggleMenu" class="left_menu_btn">
          <i :class="showMenu ? 'iconfont icon-zuo' : 'iconfont icon-you'"></i>
        </div>
        <el-menu
          :router="true"
          :mode="'vertical'"
          :collapse="!showMenu"
          :unique-opened="true"
          :collapse-transition="false"
          :default-active="activePath"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#406BFF">
          <!-- 遍历一级菜单 -->
          <el-submenu v-for="(item) in menuList" :key="item.id" :index="item.id + ''">
            <template slot="title">
              <i class="menu_item_icon" :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 遍历二级菜单 -->
            <el-menu-item @click="menuItem('/' + itemSon.path, item.id, itemSon.id)" v-for="(itemSon) in item.children" :key="itemSon.id" :index=" '/' + itemSon.path">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{itemSon.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {getNavitem} from 'network/managementView'
export default {
  name: 'ManagementView',
  data () {
    return {
      menuList: [],  // 左侧菜单
      iconsObj: {   // 图片对象
        '125': 'iconfont icon-yonghu',
        '103': 'iconfont icon-quanxian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-dingdan',
        '145': 'iconfont icon-iconfontpaixingbang'
      },
      showMenu: true,   // 显示/隐藏菜单
      activePath: '',  // 菜单激活路径
    }
  },
  methods: {
    // 退出按钮
    exitBtn() {
      window.sessionStorage.clear();  // 清除token
      this.$router.push("/login")
    },

    // 左侧菜单显示隐藏
    toggleMenu(){
      this.showMenu = !this.showMenu
    },

    // 子菜单高亮
    menuItem(path, Fid, Sid) {
      window.sessionStorage.setItem("activePath", path)
      this.activePath = path
      let menuName1 = (this.menuList.find( item => item.id == Fid)).authName
      let menuName2 = ((this.menuList.find( item => item.id == Fid)).children.find( i => i.id == Sid )).authName
      let arrName = [menuName1, menuName2]
      window.sessionStorage.setItem("menuName", JSON.stringify(arrName))
    }
  },

  // 页面加载生命周期函数
  created () {
    // 获取左侧菜单数据
    getNavitem().then(res => {
      this.menuList = res.data.data
    })

    // 获取菜单激活索引
    this.activePath = window.sessionStorage.getItem("activePath")
  }
}

</script>
<style scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373D41;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.el-aside{
  background-color: #333744;
  position: relative;
  overflow: visible;
  transition: all 0.2s linear;
}
.left_menu_btn{
  position: absolute;
  width: 20px;
  height: 80px;
  background-color: #333744;
  z-index: 10;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.left_menu_btn .iconfont{
  color: #fff;
}
.el-main{
  background-color: #EAEDF1;
  padding: 30px 35px;
}
.header_logo_box{
  display: flex;
  align-items: center;
}
.header_logo_box span{
  color: #fff;
  font-weight: 550;
  font-size: 1.3em;
  margin-left: 10px;
}
.header_logo{
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #fff;
  float: left;
}
.header_logo img{
  width: 100%;
  height: 100%;
  position: relative;
  top: -1px;
}
.header_exit{
  float: right;
}
.menu_item_icon{
  margin-right: 12px;
}
.el-menu{
  border: 0;
}
</style>