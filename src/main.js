import Vue from 'vue'
import App from './App.vue'
import router from './router'   // 引入router
import store from './store'  // 引入Vuex
import ElementUI from 'element-ui'; // 导入element-ui包
import 'element-ui/lib/theme-chalk/index.css'; // 导入相关样式
import { Message } from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'  // 使用富文本组件
Vue.use(ElementUI); // 引用
import TreeTable from "vue-table-with-tree-grid"
Vue.component('tree-table', TreeTable)  // 全局注册组件

import './assets/css/iconfont.css'   // 字体图标
import './assets/css/base.css'  // 基本全局样式
import 'quill/dist/quill.core.css' // 导入富文本编辑器样式
import 'quill/dist/quill.snow.css' 
import 'quill/dist/quill.bubble.css' 

Vue.use(VueQuillEditor)  // 注册全局组件

Vue.prototype.$message = Message   // 挂载到全局中
Vue.prototype.$EventBus = new Vue()  // 创建事件总线
Vue.config.productionTip = false
Vue.filter("dataFormat", function(originVal) {  // 定义全局过滤器
  const dt = new Date(originVal);  // 创建时间对象
  const y = dt.getFullYear();  // 获取年份
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');  // 获取月份
  const d = (dt.getDate()+ '').padStart(2, '0');  // 获取日期
  const h = (dt.getHours() +'').padStart(2, '0'); 
  const mi = (dt.getMinutes() +'').padStart(2, '0');
  const s = (dt.getSeconds() +'').padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${mi}:${s}`
})  

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
