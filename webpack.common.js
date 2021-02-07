const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const distPath = path.resolve(__dirname, 'public')

module.exports = {
  entry: {
    main: './src/main.js',
  },
  output: {
    filename: '[name]-[hash].js',
    path: distPath,
    assetModuleFilename: 'images/[hash][ext][query]'
  },
  plugins: [
    new webpack.DefinePlugin({
      GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
    }),
    new CleanWebpackPlugin({
      verbose: true,
    }),
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
        test: /\.(ico|svg|jpe?g|png|webp)$/,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          'style-loader',
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
