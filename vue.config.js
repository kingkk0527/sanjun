const path = require('path');
const name = 'Vue Typescript Admin';
const IS_PROD = ['production', 'development'].includes(process.env.NODE_ENV);

module.exports = {
  'publicPath': process.env.NODE_ENV === 'production' ? './' : '/', // TODO: Remember to change this to fit your need
  'lintOnSave': process.env.NODE_ENV === 'development',
  'pwa': {
    'name': name
  },
  'pluginOptions': {
    'style-resources-loader': {
      'preProcessor': 'scss',
      'patterns': [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
    }
  },
  // 开启代理
  devServer: { // 配置跨域
    port: 8888, // 端口号
    open: true, // 配置自动启动浏览器
    disableHostCheck: true, // 关闭域名检查
    hot: true, // 自动保存
    overlay: { // 全屏模式下是否显示脚本错误
      warnings: false, // 不显示警告
      errors: true // 显示错误
    },
    proxy: {
      '/api': {
        target: process.env.VUE_APP_URL, // 跨域地址 默认 VUE_APP_URL 可以去.env.development 里面配置
        ws: false, // 是否启用websockets
        secure: true, // 如果是https接口，需要配置这个参数 默认 false
        changeOrigin: true, // 是否跨域
        pathRewrite: { // 重写路径
          '^/api': '' // 默认所有请求都加了/api 需要去掉
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.symlinks(true); // 修复热更新失效
  },
  configureWebpack: {
    devtool: 'source-map'
  },

  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: IS_PROD,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
    },
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  }
};
