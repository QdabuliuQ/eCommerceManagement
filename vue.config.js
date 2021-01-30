module.exports = {
    publicPath: './',
    configureWebpack: {
        resolve: {
            alias: {
                'assets':'@/assets',
                'common':'@/common',
                'components':'@/components',
                'network':'@/network',
                'views':'@/views',
            }
        }
    },
    chainWebpack: config => {
        // 根据开发或者发布阶段决定 程序的入口文件
        config.when(process.env.NODE_ENV === "production", config => {  // 发布模式
            config.entry('app').clear().add('./src/main-prod.js')
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

            // 发布模式下显示不同的title标题，并且引入cdn资源，在开发模式下则不需要引入cdn资源
            config.plugin('html').tap(args => {
                args[0].isProd = true;  // 追加isProd属性
                return args
            })
        })
        config.when(process.env.NODE_ENV === "development", config => {  // 开发模式
            config.entry('app').clear().add('./src/main-dev.js')
        })
    }
}