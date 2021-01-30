import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 路由懒加载
// webpackChunkName可以将多个组件打包成为一个组
const login = () => import(/* webpackChunkName: "login_managementView_welcomeView" */ "views/login/Login.vue")  // 登录页面
const managementView = () => import(/* webpackChunkName: "login_managementView_welcomeView" */ "views/managementView/ManagementView.vue")  // 管理页面
const welcomeView = () => import(/* webpackChunkName: "login_managementView_welcomeView" */ "views/welcomeView/WelcomeView.vue")  // 欢迎界面
const User = () => import(/* webpackChunkName: "User_Power_Roles" */ "views/userView/User.vue")  // 用户界面
const Power = () => import(/* webpackChunkName: "User_Power_Roles" */ "views/powerView/Power.vue")  // 权限页面
const Roles = () => import(/* webpackChunkName: "User_Power_Roles" */ "views/rolesView/Roles.vue")  // 角色页面
const CategoryView = () => import(/* webpackChunkName: "CategoryView_ParamsView_GoodsView" */ "views/categoryView/CategoryView.vue")  // 分类页面
const ParamsView = () => import(/* webpackChunkName: "CategoryView_ParamsView_GoodsView" */ "views/paramsView/ParamsView.vue")  // 参数页面
const GoodsView = () => import(/* webpackChunkName: "CategoryView_ParamsView_GoodsView" */ "views/goodsView/GoodsView.vue")  // 商品页面
const AddGoodsView = () => import(/* webpackChunkName: "AddGoodsView_OrderView_ReportView" */ "views/addGoodsView/AddGoodsView.vue")  // 添加商品页面
const OrderView = () => import(/* webpackChunkName: "AddGoodsView_OrderView_ReportView" */ "views/orderView/OrderView.vue")  // 订单页面 
const ReportView = () => import(/* webpackChunkName: "AddGoodsView_OrderView_ReportView" */ "views/reportView/ReportView.vue")  // 数据报表

const routes = [
  { path: '/', redirect: '/login' },   // 路由重定向
  { path: '/login', component: login },
  { 
    path: '/managementView', 
    component: managementView, 
    redirect: '/welcome',   // 路由重定向
    children:[
      { path: '/welcome', component: welcomeView },
      { path: '/users', component: User},
      { path: '/rights', component: Power},
      { path: '/roles', component: Roles },
      { path: '/categories', component: CategoryView },
      { path: '/params', component: ParamsView },
      { 
        path: '/goods', 
        name: 'goods',
        component: GoodsView,
      },
      { path: '/addGoods', name: 'addGoods', component: AddGoodsView },
      { path: '/orders', component: OrderView },
      { path: '/reports', component: ReportView }
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
