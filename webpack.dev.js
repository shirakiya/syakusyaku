const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    compress: false,
    publicPath: '/',
    host: '0.0.0.0',
    port: 8080,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.tmpl.html',
      title: '(dev)尺々',
    }),
  ],
})
