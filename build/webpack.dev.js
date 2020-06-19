/*
 * @Date: 2020-06-16 10:04:47
 * @Description: 开发环境dev-webpack的配置
 * @Author: Ada
 * @FilePath: \official-website\build\webpack.dev.js
 * @LastEditors: Ada
 * @LastEditTime: 2020-06-18 15:29:58
 */
'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.js')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

// 端口查找
const portfinder = require('portfinder')
const os = require('os')

// 获取本机ip
function getIPAddress() {
  // 网络接口
  var interfaces = os.networkInterfaces()
  for (let devName in interfaces) {
    var iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      var alias = iface[i]
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}
const Host = getIPAddress()

const devWebpackConfig = merge(base, {
  mode: 'development',

  // watch: true, //开启自动监听，编译完，还需手动刷新浏览器 ,所以更好的替代方法是-----热更新插件
  //只有开启监听模式时，watchOptions才有意义
  // watchOptions: {
  // 不监听的文件，默认为空，设置忽略node_modules，性能会提高
  // ignore: /node_modules/,
  //监听到变化发生后会等300ms再去执行，默认300ms
  // aggregateTimeOut: 300,
  //判断文件是否发生变化是通过不停询问系统指定文件有没有变化实现的，默认没秒问1000次
  // poll: 1000,
  // },

  module: {
    rules: [
      {
        test: /.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /.(png|jpg|gif|jpeg|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false, //禁止使用ES模块语法,默认是开启true ，一定要设置禁止false
              limit: 10240, //小于10k,较小资源自动base64
              name: '[name].[ext]', // hash默认32位，取其前8位,输出到文件夹,基于output根目录
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader',
      },
    ],
  },
  plugins: [
    // 热更新插件
    new webpack.HotModuleReplacementPlugin(),
    // 热加载时直接返回更新文件名，而不是文件的id
    new webpack.NamedModulesPlugin(),
  ],
  devServer: {
    contentBase: '../dist',
    open: true, //自动拉起浏览器
    compress: true, //gzip压缩
    hot: true,
    overlay: {
      //出现错误时候全屏覆盖，只显示错误，不显示警告
      warnings: false,
      errors: true,
    },
    // host: '0.0.0.0', // 可从外部访问
    historyApiFallback: true, //使用html5历史记录api
  },
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = 8080 //设置获取默认端口
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      devWebpackConfig.devServer.port = port
      devWebpackConfig.plugins.push(
        new FriendlyErrorsWebpackPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${Host}:${port}`,
            ],
          },
          onErrors: function (severity, errors) {
            const notifier = require('node-notifier')
            if (severity !== 'error') return
            notifier.notify({
              title: '小笨蛋',
              message: '运行出错啦,快去看看错误提示吧',
            })
          },
        })
      )
      resolve(devWebpackConfig)
    }
  })
})
