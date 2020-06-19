/*
 * @Date: 2020-06-18 09:33:37
 * @Description:webpack基础配置
 * @Author: Ada
 * @FilePath: \official-website\build\webpack.base.js
 * @LastEditors: Ada
 * @LastEditTime: 2020-06-19 09:47:15
 */
const path = require('path')

const copyWebpackPlugin = require('copy-webpack-plugin')

const { entries, htmlWebpackPlugins } = require('./entries.js')

function resolve(dir) {
  return path.resolve(__dirname, '../', dir)
}

module.exports = {
  entry: entries,
  output: {
    path: resolve('dist'),
    filename: 'pages/[name]/[name].js',
    // publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.less', 'css', '.json', '.vue'],
    alias: {
      '@': resolve('src'),
    },
  },
  module: {
    rules: [
      // 解决这个问题:图片会被打包，而且路径也处理妥当
      // 额外提供html的include子页面功能
      {
        test: /\.html$/i, // 正则匹配html结尾的文件
        use: 'html-withimg-loader',
      },
      //ES6转ES5往低兼容
      {
        test: /\.js$/,
        exclude: /node_modules/, //排除哪个文件夹
        include: resolve('src'), //包括哪个文件夹
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    // 在构建过程中复制源树中已经存在的文件
    new copyWebpackPlugin({
      patterns: [
        {
          from: 'static',
          to: 'static',
        },
      ],
    }),
  ].concat(htmlWebpackPlugins),
}
