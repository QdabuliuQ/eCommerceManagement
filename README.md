# E-commerce Management 电商后台管理系统
### 项目API接口来自黑马提供，接口根路径：`https://www.liulongbin.top:8888/api/private/v1/`，[点击查看API接口文档](https://pan.baidu.com/s/1KJPfaFaPadW4JdGjCt54NQ )，提取码：mgbr

#### 项目技术栈：
* Vue2：采用最新Vue2的语法
* Vuex：管理公共组件状态量
* Vue-router：管理项目页面应用路由
* Axios：用于发送网络请求
* Webpack：自动化构建工具，主要配置vue-cli脚手架提供。
* ES6：采用ES6语法

#### 项目要点：
* 1、token的注意事项
  * 1.1、在登录界面发送网络请求后获取到的 `token` 通过调用 `window.sessionStorage.setItem("token", res.data.data.token)` 存储到本地中，使用 sessionStorage 方法的原因：在关闭浏览器后清除内存，token属于一次性生效的数据，当退出或者关闭浏览器的时候清除
  * 1.2、为了防止用户跳转进需要权限登录才能进去的页面的时候，通过给全局的路由对象挂载路由守卫，对路径和token进行判断
  ```js
  // 防止没有权限的用户访问了需要权限的路由
  // 使用路由导航守卫进行判断
  // 给全局路由对象挂载导航守卫
  router.beforeEach((to, from, next) => {
    // to表示将要跳转的路由路径
    // from表示从哪个路由路径跳转
    // next表示放行，可以传入路径进行强制跳转
    if (to.path == "/login") return next()   // 如果用户的路径在登录 则直接放行
    // 如果用户进行需要token的页面，先从本地存储中获取token
    const tokenStr = window.sessionStorage.getItem("token")
    if (!tokenStr) return next("/login")   // 判断token是否存在
    next()
  })
  ```

* 2、API请求头
  * 2.1、在项目的API文档中要求：在对所有需要权限的API接口进行访问的时候都需要在请求头中添加 `Authorization` 字段提供 `token` 才能发送请求
  * 2.2、使用 Axios 中的拦截器完成，在回调函数中的 `config` 的 header 中进行添加 `token`
  ```js
  // 拦截请求
  // use方法传递两个函数
  // 拦截器在发送请求成功后，对该请求进行拦截，在发送请求就会输出 config
  // 通过 return 将拦截的内容返回，则不会触发 err
  instance.interceptors.request.use(config => {
    // api要求在对需要权限的所有api接口都要在请求头中添加 `Authorization` ：token
    config.headers.Authorization = window.sessionStorage.getItem("token")  // 将token放入请求头中
    return config
  })
  ```

* 3、基于Elementui中的Breadcrumb组件进行二次封装
  * 3.1、通过 props 父子组件通信进行传递数据，在父组件调用的时候必须传入一个数组
  ```html
  <template>
    <div id="BrandCrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="firstItem">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in crumbList" :key="index">{{item}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </template>
  ```
  ```js
  props: {
    // 菜单项
    crumbList: {
      type: Array,
      default: () => ["用户管理","用户列表"]
    }
  },
  ```
  * 3.2、在导航栏切换的时候通过获取 Fid(一级菜单的id) 和 Sid(二级菜单的id) 通过 find 函数搜索到对应的一级菜单名称和二级菜单名称。保存到数组中，并转为`JSON`格式保存到内存中。
  ```js
  let menuName1 = (this.menuList.find( item => item.id == Fid)).authName
  let menuName2 = ((this.menuList.find( item => item.id == Fid)).children.find( i => i.id == Sid )).authName
  let arrName = [menuName1, menuName2]
  window.sessionStorage.setItem("menuName", JSON.stringify(arrName))
  ```
  * 3.3、在之前实现该功能的时候使用过`EventBus事件总线`通过点击菜单，发送事件总线给对应的组件，但是在点击菜单后开始发送事件总线的时候，由于组件还未被创建出来，导致组件无法接收到数据从而出现BUG，所以才使用本地储存的方式。