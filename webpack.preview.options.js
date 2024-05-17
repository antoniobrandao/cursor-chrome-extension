const { merge } = require('webpack-merge')
const path = require('path')
const common = require('./webpack.preview.common.js')

module.exports = merge(common, {
  entry: path.resolve(__dirname, 'src', 'preview', 'options.tsx'),
})
