const { merge } = require('webpack-merge')
const path = require('path')
const common = require('./webpack.preview.common.js')

module.exports = merge(common, {
  entry: path.join(__dirname, 'src', 'preview', 'app.tsx'),
})
