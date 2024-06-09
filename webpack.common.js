const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const WebpackBar = require('webpackbar')
const StylelintPlugin = require('stylelint-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const CleanCSSPlugin = require('less-plugin-clean-css')
const { merge } = require('webpack-merge')

const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

const PATHS = {
  buildDev: path.resolve(__dirname, 'dist'),
  buildProd: path.resolve(__dirname, 'dist'),
  appSrc: path.resolve(__dirname, 'src'),
  appNodeModules: path.join(__dirname, 'node_modules'),
}

exports.PATHS = PATHS

const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/

const getStyleLoaders = (cssOptions, preProcessor, preProcessorOptions) => {
  const loaders = [
    isDev && require.resolve('style-loader'),
    isProd && {
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: false,
      },
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
    },
  ].filter(Boolean)

  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isProd ? shouldUseSourceMap : isDev,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: preProcessorOptions,
      }
    )
  }
  return loaders
}

const commonConfig = merge([
  {
    target: isProd ? ['web', 'es5'] : 'web',
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
        path: `.env.${process.env.NODE_ENV}`,
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
        failOnError: process.env.NODE_ENV === 'development',
        cacheLocation: path.resolve(
          PATHS.appNodeModules,
          '.cache/.eslintcache'
        ),
      }),
    ],
    module: {
      rules: [
        // CSS Module
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: isProd ? shouldUseSourceMap : isDev,
          }),
        },
        {
          test: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: isProd ? shouldUseSourceMap : isDev,
            module: {
              getLocalIdent: getCSSModuleLocalIdent,
            },
          }),
        },

        // LESS Module
        {
          test: lessRegex,
          exclude: lessModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              sourceMap: isProd ? shouldUseSourceMap : isDev,
            },
            'less-loader',
            {
              lessOptions: {
                javascriptEnabled: true,
                plugins: [new CleanCSSPlugin({ advanced: true })],
              },
            }
          ),
        },
        {
          test: lessModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 3,
              sourceMap: isProd ? shouldUseSourceMap : isDev,
              modules: {
                getLocalIdent: getCSSModuleLocalIdent,
              },
            },
            'less-loader',
            {
              lessOptions: {
                javascriptEnabled: true,
                plugins: [new CleanCSSPlugin({ advanced: true })],
              },
            }
          ),
        },

        // Bundle Loader
        {
          test: /\.[tj]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'swc-loader',
            options: {
              module: {
                type: 'es6',
              },
              minify: process.env.NODE_ENV !== 'development',
              isModule: true,
              jsc: {
                minify: {
                  compress: true,
                  mangle: true,
                  format: {
                    asciiOnly: true,
                    comments: /^ webpack/,
                  },
                },
                target: 'es2016',
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                  },
                },
              },
            },
          },
        },

        // Assets loader
        {
          test: /\.(png|jpe?g|gif)$/i,
          type: 'asset/resource',
        },

        // SVG Loader
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },

        // File Loader
        {
          test: /\.(otf|woff|woff2)$/i,
          use: ['file-loader'],
        },
      ],
    },
  },
])

exports.commonConfig = commonConfig
