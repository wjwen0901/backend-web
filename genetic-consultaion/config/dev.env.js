'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    BASE_URL: '"http://localhost:9100/mdhcare-backend"',
    // DISEASE_API: '"http://localhost:9200"',
    // // BASE_URL: '"https://qa.mdhcare.com/mdhcare-backend"',
    DISEASE_API: '"https://qa.mdhcare.com/mdhcare-backend"',
    PRODUCT: '"https://qa.mdhcare.com/mdhcare-pc"'


  // BASE_URL: '"https://www.mdhcare.cn/mdhcare-backend"',
  // DISEASE_API: '"https://www.mdhcare.cn/mdhcare-backend/"',
  // PRODUCT: '"https://www.mdhcare.cn/mdhcare-pc"'
})
