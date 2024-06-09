const { merge } = require('webpack-merge')
const { commonConfig } = require('./webpack.common')
const { developmentConfig } = require('./webpack.development')
const { productionConfig } = require('./webpack.production')

// Load .env file variables
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

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

  const currentEnv = options[process.env.NODE_ENV]
  return merge(...currentEnv.configs)
}
