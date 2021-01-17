# E-commerce Management 电商后台管理系统
### 项目API接口来自黑马提供，接口根路径：`https://www.liulongbin.top:8888/api/private/v1/`，[点击查看API接口文档](https://pan.baidu.com/s/1KJPfaFaPadW4JdGjCt54NQ )

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