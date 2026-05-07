'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const mdhcareBackendTarget = process.env.MDHCARE_BACKEND_TARGET || 'http://127.0.0.1:9101'
const mdhcarePcTarget = process.env.MDHCARE_PC_TARGET || 'http://127.0.0.1:9900'
const externalLoginRE = /^https?:\/\/(z|qa|www)\.mdhcare\.(cn|com)\/.*login\.html/

function stopExternalLoginRedirect (proxyRes) {
  const location = proxyRes.headers && proxyRes.headers.location
  if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && location && externalLoginRE.test(location)) {
    proxyRes.statusCode = 401
    proxyRes.statusMessage = 'DEV_UNAUTHORIZED'
    delete proxyRes.headers.location
  }
}

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: 'https://trade.youzan.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/mdhcare-backend': {
        target: mdhcareBackendTarget,
        changeOrigin: true,
        onProxyRes: stopExternalLoginRedirect,
        pathRewrite: {
          '^/mdhcare-backend': '/mdhcare-backend'
        }
      },
      '/mdhcare-pc': {
        target: mdhcarePcTarget,
        changeOrigin: true,
        pathRewrite: {
          '^/mdhcare-pc': '/mdhcare-pc'
        }
      }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 3100, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
