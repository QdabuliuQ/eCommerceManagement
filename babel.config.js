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
