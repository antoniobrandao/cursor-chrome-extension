const webpack = require('webpack')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const srcDir = path.join(__dirname, 'src')

module.exports = {
  entry: {
    options: path.join(srcDir, 'options.tsx'),
    background: path.join(srcDir, 'background.tsx'),
    content_script: path.join(srcDir, 'content_script.tsx'),
    toggle_icon: path.join(srcDir, 'toggle_icon.tsx'),
    app: path.join(srcDir, 'app.tsx'),
    popup: path.join(srcDir, 'popup.tsx'),
    cleanup: path.join(srcDir, 'cleanup.tsx'),
    popup_invoker: path.join(srcDir, 'popup_invoker.tsx'),
    wake_event: path.join(srcDir, 'wake_event.tsx'),
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js',
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
  plugins: [
    new CopyPlugin({
      patterns: [{ from: '.', to: '../', context: 'public' }],
      options: {},
    }),
  ],
}
