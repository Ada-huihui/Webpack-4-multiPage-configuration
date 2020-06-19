/*
 * @Date: 2020-06-18 09:22:40
 * @Description:页面多入口处理
 * @Author: Ada
 * @FilePath: \official-website\build\entries.js
 * @LastEditors: Ada
 * @LastEditTime: 2020-06-19 11:37:44
 */

const path = require('path')

// 查找符合特定规则的文件路径名
const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const setMPA = () => {
  // 暴露出去的入口
  const entries = {}

  // 暴露出去的html5页面
  const htmlWebpackPlugins = []

  const entryFiles = glob.sync(path.join(__dirname, '../src/pages/*/*.js'))

  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index]
    const match = entryFile.match(/pages\/(.*)\/(.*)\.js/)
    const pageName = match && match[1]
    entries[pageName] = entryFile
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        // inlineSource: '.css$',
        // multihtmlCatch: true, // 开启多入口缓存
        template: path.resolve(
          __dirname,
          `../src/pages/${pageName}/${pageName}.html`
        ),
        filename:
          pageName === 'index'
            ? `${pageName}.html` //入口页面放最外面
            : `pages/${pageName}/${pageName}.html`,
        chunks: [pageName],
        inject: true,
        minify:
          process.env.NODE_ENV == 'development'
            ? false
            : {
                removeAttributeQuotes: true, //删除html属性的双引号
                collapseWhitespace: true, //折叠空行，把所有的html折叠成一行
              },
      })
    )
  })

  return {
    entries,
    htmlWebpackPlugins,
  }
}
const { entries, htmlWebpackPlugins } = setMPA()

module.exports = {
  entries,
  htmlWebpackPlugins,
}
