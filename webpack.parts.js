const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const CleanCSSPlugin = require('less-plugin-clean-css')

const isProd = process.env.NODE_ENV === 'production'
const isDev = process.env.NODE_ENV === 'development'
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'

exports.isProd = isProd
exports.isDev = isDev

const paths = {
  buildDev: path.resolve(__dirname, 'dist'),
  buildProd: path.resolve(__dirname, 'dist'),
  appSrc: path.resolve(__dirname, 'src'),
  appNodeModules: path.join(__dirname, 'node_modules'),
}

exports.PATHS = paths

exports.swcLoader = () => ({
  module: {
    rules: [
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
    ],
  },
})

exports.assetsLoader = () => ({
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
})

exports.svgLoader = () => ({
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
})

exports.fileLoader = () => ({
  module: {
    rules: [
      {
        test: /\.(otf|woff|woff2)$/i,
        use: ['file-loader'],
      },
    ],
  },
})

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

exports.cssModule = () => ({
  module: {
    rules: [
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
    ],
  },
})

exports.lessModule = () => ({
  module: {
    rules: [
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
    ],
  },
})
