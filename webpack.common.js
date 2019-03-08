const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const distPath = path.resolve(__dirname, 'dist')

module.exports = {
  entry: {
    main: './src/js/main.js',
  },
  output: {
    filename: '[name]-[hash].js',
    path: distPath,
  },
  plugins: [
    new CleanWebpackPlugin([distPath]),
    new VueLoaderPlugin(),
    new Dotenv({
      path: './.env',
    }),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          'presets': [
            [
              '@babel/preset-env',
              {
                modules: false,
                useBuiltIns: 'usage'
              },
            ],
          ],
        },
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'style-loader',
          'css-loader?url=false',
          'stylus-loader',
        ],
      }
    ],
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.min.js',
    },
  },
}
