const { mergeWithRules } = require('webpack-merge')
const common = require('./webpack.common.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = mergeWithRules({
  module: {
    rules: {
      test: 'match',
      use: 'replace',
    },
  },
})(common, {
  mode: 'production',
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[fullhash].css',
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.tmpl.html',
      title: '尺々 ~地図に好きな直径の円を置く~',
      minify: false,
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                indentedSyntax: true,
              },
            },
          },
        ],
      }
    ],
  },
})
