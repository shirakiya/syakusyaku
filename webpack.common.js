const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
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
    new webpack.DefinePlugin({
      'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY),
    }),
    new CleanWebpackPlugin([distPath]),
    new VueLoaderPlugin(),
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
        include: '/node_modules/vuetify',
        loader: 'babel-loader',
        options: {
          'presets': [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: [
                    'last 2 versions',
                    'Chrome >= 41',
                  ],
                },
                modules: false,
                useBuiltIns: 'usage',
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
