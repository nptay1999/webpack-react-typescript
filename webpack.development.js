const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { merge } = require('webpack-merge')
const { PATHS } = require('./webpack.common')

const developmentConfig = merge([
  {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      port: 5000,
      open: true,
      hot: true,
      historyApiFallback: true,
      compress: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
    output: {
      publicPath: '/',
      path: `${PATHS.buildDev}`,
    },
    resolve: {},
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      }),
      new ReactRefreshWebpackPlugin({ overlay: false }),
      new ForkTsCheckerWebpackPlugin(),
    ],
  },
])

exports.developmentConfig = developmentConfig
