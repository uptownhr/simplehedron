var path = require('path');
var webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin")

const url = `http://${process.env.VIRTUAL_HOST}`
console.log(url)
var settings = {
  'dev': {
    devtool: 'source-map',
    entry: {
      dashboard: [
        'webpack-dev-server/client?http://webpack.simple.docker',
        'webpack/hot/dev-server',
        './src/dashboard'
      ],
      site: [
        'webpack-dev-server/client?http://webpack.simple.docker',
        'webpack/hot/dev-server',
        './src/site'
      ]
    },
    output: {
      path: path.join(__dirname, 'static'),
      filename: '[name].js',
      publicPath: '/static/'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loaders: ['babel'],
          include: path.join(__dirname, 'src')
        },{
          test: /\.scss$/,
          //loaders: ["style", "css?sourceMap", "sass?sourceMap"],
          loaders: ["style", "css", "resolve-url", "sass?sourceMap"]
        },
        { test: /\.css$/, loader: "style!css" },
        { test: /\.(png|jpg|gif|svg)$/, loader: 'url-loader?limit=10240' },
        { test: /\.html$/, loader: 'html' }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.CommonsChunkPlugin("common", "common.js")
    ]
  },

  'prod': {
    devtool: 'eval',
    entry: [
      './src/index'
    ],
    output: {
      path: '/app/public/static',
      filename: 'bundle.js',
      publicPath: 'http://webpack.bambeecom.docker/static/'
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          loaders: ['babel'],
          include: path.join(__dirname, 'src')
        },
        { test: /\.css|scss$/, loader: ExtractTextPlugin.extract("style", "css!sass") },
        { test: /\.css$/, loader: "style!css" },
        { test: /\.png$/, loader: 'url-loader?limit=10240' },
        { test: /\.html$/, loader: 'html' }
      ]
    },
    plugins: [
      new ExtractTextPlugin("styles.css")
    ]
  }
}


console.log("WTF", settings[process.env.ENV])

module.exports = settings[process.env.ENV]
