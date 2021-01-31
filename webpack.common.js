const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

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
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new ESLintPlugin({
      extensions: ['js', 'vue'],
    }),
  ],
  module: {
    rules: [
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
          presets: [
            [
              '@babel/preset-env',
              {
                targets: [
                  'last 2 version',
                  'not dead',
                ],
                modules: false,
                useBuiltIns: 'usage',
                corejs: 3,
              },
            ],
          ],
        },
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          'vue-style-loader',
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
      },
    ],
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.min.js',
    },
  },
}
