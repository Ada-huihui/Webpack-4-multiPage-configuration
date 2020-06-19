/*
 * @Date: 2020-06-16 10:04:47
 * @Description:生产环境dev-webpack的配置
 * @Author: Ada
 * @FilePath: \official-website\build\webpack.prod.js
 * @LastEditors: Ada
 * @LastEditTime: 2020-06-18 17:42:11
 */
'use strict'

const merge = require('webpack-merge')
const base = require('./webpack.base.js')
//把css提立出来作为一个独立的文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

//css文件压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

//引入清除插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = merge(base, {
  mode: 'production',
  // 便于调试,可以快速还原代码的错误位置
  devtool: 'cheap-module-eval-source-map',
  // output: {
  //   publicPath: '../../',
  // },
  module: {
    rules: [
      //解析css - style-loader将样式通过<style>标签插入到head中 - css-loader用于加载.css文件，并且转换成common.js对象
      {
        test: /.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  overrideBrowserslist: [
                    'defaults',
                    '> 1%',
                    'last 10 versions',
                    'Firefox < 20',
                    'not ie <= 8',
                    'ios > 7',
                    'cover 99.5%',
                  ],
                }),
              ],
            },
          },
        ],
      },
      {
        test: /.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader', //@import语法解析路径
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  overrideBrowserslist: [
                    // 要兼容的浏览器的版本
                    'ie >= 8',
                    'Firefox >= 20',
                    'Safari >= 5',
                    'Android >= 4',
                    'Ios >= 6',
                    'last 4 version',
                  ],
                }),
              ],
            },
          },
          'less-loader',
        ],
      },

      // 解析图片 file-loader与url-Loader都差不多，用于处理文件，但后者可以设置较小资源自动base64
      {
        test: /.(png|jpg|gif|jpeg|svg)$/,
        use: [
          {
            loader: 'url-loader',

            options: {
              esModule: false,
              limit: 10240, // 把较小的图片转换成base64的字符串内嵌在生成的js文件里
              name: '[name]_[hash:8].[ext]', // hash默认32位，取其前8位,输出到文件夹,基于output根目录
              outputPath: 'assets/img',

              // publicPath: '../../assets/',
            },
          },
        ],
      },
      // 解析字体 file-loader用于处理文件
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'iconfont/[name]_[hash:8].[ext]', // hash默认32位，取其前8位
            },
          },
        ],
      },
    ],
  },
  plugins: [
    //清空文件下的多余文件
    new CleanWebpackPlugin(),

    //独立css
    new MiniCssExtractPlugin({
      filename: 'pages/[name]/[name]_[contenthash:8].css',
    }),

    // 压缩css
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
    }),
  ],
})
