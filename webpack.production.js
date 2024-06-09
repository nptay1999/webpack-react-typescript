const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { merge } = require('webpack-merge')
const { PATHS } = require('./webpack.common')

const productionConfig = merge([
  {
    mode: 'production',
    output: {
      publicPath: '/',
      path: `${PATHS.buildProd}`,
      filename: '[name].[chunkhash].bundle.js?v=[chunkhash]',
    },
    resolve: {},
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css?v=[contenthash]',
        chunkFilename: '[id].[contenthash].css?v=[contenthash]',
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new WorkboxPlugin.GenerateSW({
        // these options encourage the ServiceWorkers to get in there fast
        // and not allow any straggling "old" SWs to hang around
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 5242880,
      }),
    ],
    optimization: {
      moduleIds: 'deterministic',
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'node_vendors', // part of the bundle name and
            test: /node_modules\/(?!antd\/).*/,
            chunks: 'all',
          },
          styles: {
            name: 'styles',
            test: /\.(sa|sc|c|le)ss$/,
            chunks: 'all',
          },
        },
        chunks: 'all',
      },
      runtimeChunk: {
        name: entrypoint => `runtimechunk~${entrypoint.name}`,
      },
      minimizer: [
        new CssMinimizerPlugin(),
        new TerserPlugin({
          minify: TerserPlugin.swcMinify,
          extractComments: false,
          parallel: true,
        }),
      ],
    },
  },
])

exports.productionConfig = productionConfig
