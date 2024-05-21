const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { merge } = require('webpack-merge')
const path = require('path')
const parts = require('./webpack.parts')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const WebpackBar = require('webpackbar')
const StylelintPlugin = require('stylelint-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

// Load .env file variables
require('dotenv').config({ path: `.env.${process.env.APP_ENV}` })

const PATHS = parts.PATHS

const commonConfig = merge([
  {
    target: parts.isProd ? ['web', 'es5'] : 'web',
    resolve: {
      modules: ['src', 'node_modules'],
      extensions: ['.js', '.tsx', '.ts', '.css', '.scss'],
      alias: {
        theme: path.resolve(PATHS.appSrc, 'theme'),
      },
    },
    entry: { index: path.resolve(__dirname, 'src', 'index.tsx') },
    plugins: [
      new WebpackBar(),
      new CopyPlugin({
        patterns: [{ from: path.resolve(__dirname, 'public', 'favicon.ico') }],
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public', 'index.html'),
        favicon: path.resolve(__dirname, 'public', 'favicon.ico'),
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
      }),
      new Dotenv({
        systemvars: true,
        allowEmptyValues: true,
        path: `.env.${process.env.APP_ENV}`,
      }),
      new StylelintPlugin({
        extensions: ['css', 'scss', 'sass', 'less'],
        cache: true,
        cacheLocation: path.resolve(
          PATHS.appNodeModules,
          '.cache/.stylelintcache'
        ),
      }),
      new ESLintPlugin({
        extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
        formatter: require.resolve('react-dev-utils/eslintFormatter'),
        eslintPath: require.resolve('eslint'),
        cache: true,
        context: PATHS.appSrc,
        lintDirtyModulesOnly: true,
        failOnError: process.env.ENV_BUILD === 'development',
        cacheLocation: path.resolve(
          PATHS.appNodeModules,
          '.cache/.eslintcache'
        ),
      }),
    ],
    module: {},
  },
  parts.cssModule(),
  parts.lessModule(),
  parts.swcLoader(),
  parts.assetsLoader(),
  parts.svgLoader(),
  parts.fileLoader(),
])

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

module.exports = () => {
  const options = {
    development: {
      message: 'DEVELOPMENT BUILD',
      configs: [commonConfig, developmentConfig],
    },
    production: {
      message: 'PRODUCTION BUILD',
      configs: [commonConfig, productionConfig],
    },
  }

  const currentEnv = options[process.env.ENV_BUILD]
  return merge(...currentEnv.configs)
}
