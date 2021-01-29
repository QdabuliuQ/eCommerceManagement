import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 路由懒加载
const login = () => import ("views/login/Login.vue")   // 登录页面
const managementView = () => import ("views/managementView/ManagementView.vue")  // 管理页面
const welcomeView = () => import ("views/welcomeView/WelcomeView.vue")  // 欢迎界面

const routes = [
  { path: '/', redirect: '/login' },   // 路由重定向
  { path: '/login', component: login },
  { 
    path: '/managementView', 
    component: managementView, 
    redirect: '/welcome',   // 路由重定向
    children:[
      { path: '/welcome', component: welcomeView },
      { path: '/users', component: () => import ("views/userView/User.vue")},
      { path: '/rights', component: () => import ("views/powerView/Power.vue")},
      { path: '/roles', component: () => import ("views/rolesView/Roles.vue") },
      { path: '/categories', component: () => import ("views/categoryView/CategoryView.vue") },
      { path: '/params', component: () => import ("views/paramsView/ParamsView.vue") },
      { 
        path: '/goods', 
        name: 'goods',
        component: () => import ("views/goodsView/GoodsView.vue"),
      },
      { path: '/addGoods', name: 'addGoods', component: () => import ("views/addGoodsView/AddGoodsView.vue") },
      { path: '/orders', component: () => import ("views/orderView/OrderView.vue") }
    ] 
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

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

export default router
