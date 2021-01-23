import Vue from 'vue'
import App from './App.vue'
import router from './router'   // 引入router
import store from './store'  // 引入Vuex
import ElementUI from 'element-ui'; // 导入element-ui包
import 'element-ui/lib/theme-chalk/index.css'; // 导入相关样式
import { Message } from 'element-ui'
Vue.use(ElementUI); // 引用
import TreeTable from "vue-table-with-tree-grid"
Vue.component('tree-table', TreeTable)  // 全局注册组件

import './assets/css/iconfont.css'   // 字体图标
import './assets/css/base.css'  // 基本全局样式

Vue.prototype.$message = Message   // 挂载到全局中
Vue.prototype.$EventBus = new Vue()  // 创建事件总线
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
