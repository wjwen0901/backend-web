'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://localhost:9100/mdhcare-backend"',
  DISEASE_API: '"http://localhost:9200"',
  DISEASE_PC_API: '"http://localhost:9900/mdhcare-pc"'
  // BASE_URL: '"https://qa.mdhcare.cn/mdhcare-backend"'
  // BASE_URL: '"https://www.mdhcare.cn/mdhcare-backend"'
})
