# E-commerce Management 电商后台管理系统
### 项目API接口来自黑马提供，接口根路径：`https://www.liulongbin.top:8888/api/private/v1/`，[点击查看API接口文档](https://pan.baidu.com/s/1KJPfaFaPadW4JdGjCt54NQ )，提取码：mgbr

#### 项目技术栈：
* Vue2：采用最新Vue2的语法
* Vuex：管理公共组件状态量
* Vue-router：管理项目页面应用路由
* Axios：用于发送网络请求
* Vue-CLI：自动化构建工具。
* ES6：采用ES6语法

#### 项目优化：
* 1、`babel-plugin-transform-remove-console`的使用
  * 1.1、在开发阶段会使用`console.log`进行调试，但是在发布阶段不需要输出
  * 1.2、在发布阶段进行编译的时候会对`console.log`提示警告信息，使用`babel-plugin-transform-remove-console`在发布阶段清除掉所有的`console.log`
  * 1.3、在依赖中选中开发依赖，按钮插件，安装完成后到`babel.config.js`文件进行配置，将 transform-remove-console 作为数组元素添加到 plugins 数组中
  * 1.4、为了在开发阶段能够使用`console.log`，所以可以进行条件判断
  ```js
  const prodPlugins = [];  // 发布阶段需要用到的插件数组
  if (process.env.NODE_ENV === "production") {  // 判断是否在发布阶段
    prodPlugins.push('transform-remove-console')  // 添加插件
  }

  module.exports = {
    plugins: [
      ...prodPlugins  // 解构数组
    ]
  }
  ```
* 2、设置开发模式和发布模式每个的程序入口文件
  * 2.1、在根目录下创建`vue.config.js`文件夹，可以在文件夹中配置路径别名或者程序的入口文件
  * 2.2、在文件目录中分别创建`main-dev.js`(开发模式入口文件)和`main-prod.js`入口文件
  * 2.3、获取到`NODE_ENV`进行判断，如果是发布模式下，则`clear()`清除入口文件，`add()`添加发布模式下指定的入口文件
  ```js
  module.exports = {  // 固定格式
    chainWebpack: config => {
      config.when(process.env.NODE_ENV === "production", config => {  // 发布模式
        config.entry('app').clear().add('./src/main-prod.js')
      })

      config.when(process.env.NODE_ENV === "development", config => {  // 开发模式
        config.entry('app').clear().add('./src/main-dev.js')
      })
    }
  }
  ```
* 3、通过`externals`加载CDN外部资源
  * 3.1、在项目中通过`import xxx from xxx`引入的资源也会一并打包到`dist`文件夹中，导致项目变得很大，可以使用`externals`指定哪一些资源是需要从CDN引入
  * 3.2、还是在`vue.config.js`的chainWebpack对象上使用config.set()方法指定资源
  ```js
  chainWebpack: config => {
    // 根据开发或者发布阶段决定 程序的入口文件
    config.when(process.env.NODE_ENV === "production", config => { 
    // 按需导入对应的文件
    config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor',
        'element-ui': 'ElementUI'
    })
  }
  ```
  * 3.3、在`main-prod.js`文件中将所有通过`import`引入资源全部注释。
  * 3.4、在`index.html`首页，通过link的方法引入外部资源

* 4、对开发模式和发布模式进行区分
  * 4.1、通过动态设置网页的title来区分
  * 4.2、通过条件判断，在args数组的第一个元素中追加isProd属性默认为true
  ```js
  chainWebpack: config => {
    // 根据开发或者发布阶段决定 程序的入口文件
    config.when(process.env.NODE_ENV === "production", config => {  // 发布模式
      // 发布模式下显示不同的title标题，并且引入cdn资源，在开发模式下则不需要引入cdn资源
      config.plugin('html').tap(args => {
          args[0].isProd = true;  // 追加isProd属性
          return args
      })
    })
  }
  ```
  * 4.3、在`index.html`文件中使用模板字符串的方式进行条件判断
  ```html
  <title><%= htmlWebpackPlugin.options.isProd ? '' : 'dev - ' %>电商后台管理系统</title>
  ```
  * 4.4、同理，通过CDN引入的资源也要进行判断，如果是在发布模式则引入，开发模式下不需要引入，否则会出现冲突
  ```html
  <!-- 条件判断是否进入cdn资源 -->
  <% if(htmlWebpackPlugin.options.isProd) { %>  
    <!-- nprogress 的样式表文件 -->
    <link rel="stylesheet" href="https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.css" />
  <% } %>  
  <!-- 结尾符号 -->
  ```
* 5、路由的懒加载
  * 5.1、可以使用`@babel/plugin-syntax-dynamic-import`插件来实现路由的懒加载
  * 5.2、在依赖中选择开发依赖，搜索上面的关键字进行插件安装，安装完成后再`babel.config.js`文件夹中引入即可
  ```js
  const prodPlugins = [];  // 发布阶段需要用到的插件
  if (process.env.NODE_ENV === "production") {  // 判断是否在发布阶段
    prodPlugins.push('transform-remove-console')
  }

  module.exports = {
    presets: [
      '@vue/cli-plugin-babel/preset'
    ],
    plugins: [
      ...prodPlugins,  // 解构数组
      "@babel/plugin-syntax-dynamic-import"  // 路由懒加载插件
    ] 
  }
  ```
  * 5.3、在路由文件中使用`const 路由名称 = () => import(/* webpackChunkName: "组件打包分组名称" */ "组件路径")`进行引入
    * 5.3.1、webpackChunkName属性可以设置一个名称，多个组件写同一个名称将会打包到同一个文件当中
- - -

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

* 4、角色页面权限多层级的显示
  * 4.1、显示效果如下：
  ![Image text](https://img.coolcr.cn/2021/01/21/4bf04c77125a9.png)
  * 4.2、通过 elementUi 中的栅格组件来完成，`<el-row>`作为每一级级权限的一行，以此类推，使用三层 v-for 嵌套遍历生成对应的结构

* 5、用户权限树状图显示
  * 5.1、显示效果如下
  ![Image text](https://img.coolcr.cn/2021/01/21/dc6500d027b4d.png)
  * 5.2、使用了 elementUi 中的 tree 组件，通过绑定 `node-key` 关键树节点的key，还有 `default-checked-keys` 以选中节点的 id 数组，当用户点击分配权限按钮的时候获取到所有三级权限 id，并 push 到数组中去
  ```html
  <el-tree 
    :node-key="'id'"
    :default-expand-all="true"
    :default-checked-keys="selectList"
    :data="rightsList"
    show-checkbox
    :props="defaultProps">
  </el-tree>
  ```
  * 5.3、由于获取的数据比较复杂，想要获取最底层也就是三层权限的id最好通过`递归`的方式来获取，可以通过`for...of`三层循环嵌套的方式，判断 node 节点是否包含 children 子节点，如果不包含则说明是三级权限节点。如果包含说明还没有到指定的节点，通过 forEach 遍历，重新调用 getLeafKey 方法 
  ```js
  // 通过递归获取已有的权限节点id
  getLeafKey(node, arr) {
    if (!node.children) {  // 最后一个子节点是没有children节点  进入判断条件
      return arr.push(node.id)  // 将id添加到数组中
    }
    // 通过遍历node的children的子节点 将 item 作为 getLeafKey 方法的node形成传递进去
    // 进行下一步判断遍历
    node.children.forEach( item => this.getLeafKey(item, arr))
  },
  ```

* 6、分类参数页面开发出现的问题
  * 6.1、使用 elementUi 的`el-tag`组件时候，需要点击tag出现输入框，并在输入框失去焦点后发起AJAX请求，添加数据。在`el-input`中不同绑定同一个v-model属性，不然在输入的时候，遍历出来的所有输入框都会绑定到一个属性值上。可以在请求数据的时候，在获取到的数据中通过`for...of`循环添加一个自定义属性。
  ```js
  // 获取分类参数
    getParamsData() {
    getCateParams(this.selectKeys[this.selectKeys.length - 1],this.navItem.then((res) => {
      for (const item of res.data.data) {  // 遍历数据
        if (item.attr_vals != "") {
          // 判断属性值是否为空
          // 遍历属性
          item.attr_vals = item.attr_vals.split(","); // 字符串切割
        } else {
          item.attr_vals = [];
        }
      }
      if (this.navItem == "many") {
        for (const item of res.data.data) {
          item.inputValue = "";  // 手动添加inputValue属性绑定给每一个input
          item.inputVisible = false;
        }
        this.activeParamsData = res.data.data;
      } else {
        for (const item of res.data.data) {
          item.inputValue = "";  // 手动添加inputValue属性绑定给每一个input
          item.inputVisible = false;
        }
        this.staticParamsData = res.data.data;
      }
    });
  },
  ```
  * 6.2、在点击添加按钮后，必须调用input的focus方法自动获取焦点。在v-for中遍历的时候，必须给每一个input绑定不同的ref属性，如果一个都绑定了同一个ref属性的使用，当一个输入框调用了focus方法的时候，其他输入框也会同步调用。所以在遍历的时候通过拼接的方式生成不同的ref属性值
  ```html
  <el-input
    class="input-new-tag"
    v-if="scope.row.inputVisible"
    v-model="scope.row.inputValue"
    :ref="'saveTagInput' + scope.row.attr_id"
    size="small"
    @blur="handleInputConfirm(scope.row)"
  >
  ```
  * 6.3、通过 `this.$refs[属性值]` 的方式进行获取
  ```js
  // 显示输入框
  showInput(refsIndex, rowInfo) {
    rowInfo.inputVisible = true; // 隐藏按钮
    this.$nextTick(() => {
      // dom节点挂载完成回调函数
      this.$refs[refsIndex].$refs.input.focus(); // 自动获取焦点
    });
  },
  ```

* 7、nprogress插件的使用
  * 7.1、通过 npm 的方式安装插件
  * 7.2、在 request 文件中进行引入`import NProgress from "nprogress"  // 导入进度条组件`
  * 7.3、通过在两个拦截器中调用 start() 和 done() 控制进度条的显示和隐藏
  ```js
  instance.interceptors.request.use(config => {
    NProgress.start()
    // api要求在对需要权限的所有api接口都要在请求头中添加 `Authorization` ：token
    config.headers.Authorization = window.sessionStorage.getItem("token")  // 将token放入请求头中
    return config
  })

  instance.interceptors.response.use(config => {
    NProgress.done()
    return config
  })
  ```
