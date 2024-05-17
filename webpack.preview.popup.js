const { merge } = require('webpack-merge')
const common = require('./webpack.preview.common.js')

module.exports = merge(common, {
  entry: './src/preview/popup.tsx',
})
