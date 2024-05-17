const webpack = require('webpack')
const path = require('path')

module.exports = {
  context: path.resolve(__dirname),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'preview_bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
  },
  performance: {
    hints: false,
  },
  optimization: {
    minimize: false,
  },
}
