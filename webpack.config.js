const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    background: path.resolve(__dirname, './src/js/background.ts'),
    content: path.resolve(__dirname, './src/js/content.ts'),
    popup: path.resolve(__dirname, './src/js/popup.ts')
  },
  output: {
    path: path.resolve(__dirname, './extension'),
    filename: './js/[name].js'
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './css/bundle.css'
    })
  ],
  resolve: {
    extensions: [
      '.ts',
      '.js'
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        })
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: './images/[name].[ext]',
            outputPath: './',
            publicPath: path => '.' + path
          }
        }
      },
      {
        test: /\.ejs$/,
        use: 'ejs-compiled-loader'
      }
    ]
  }
}
