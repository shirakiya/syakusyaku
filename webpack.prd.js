const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge.smart(common, {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: 'index.tmpl.html',
      title: '尺々',
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
        parallel: true,
      }),
    ],
    noEmitOnErrors: true,
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.styl(us)?$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?url=false',
          'stylus-loader',
        ],
      }
    ],
  },
})
