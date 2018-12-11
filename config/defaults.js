'use strict';

const webpack = require('webpack');
const rupture = require('rupture');
const autoprefixer = require('autoprefixer');
const mixins = require('stylus-mixins');
const TextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const Svg = require('webpack-svgstore-plugin');
const config = require(__dirname + '/../app/config/compile.js');
const root = process.env.PWD;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

// assets source dir
var srcInnerDir = '/app';
var srcAbsoluteDir = root + srcInnerDir;

// assets destination dir
var destInnerDir = '/web/assets';
var destAbsoluteDir = root + destInnerDir;

// import package config
var packageConfig = require(root + '/package');

module.exports = {
  // application entry points list
  entry: {
    application: './app/index.js',
    vendors: Object.keys(packageConfig.dependencies)
  },

  // modules output configurations
  output: {
    path: destAbsoluteDir,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[id].[chunkhash].js',
    publicPath: '/assets/'
  },

  // application configuration
  resolve: {
    modulesDirectories: ['node_modules'],
    alias: {
      '@core': srcAbsoluteDir
    }
  },

  // modules configuration
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.jade$/, loader: 'jade-loader'},
      {test: /\.css$/, loader: 'style-loader'},
      {test: /\.styl$/, include: /styles/, loader: TextPlugin.extract('style-loader', 'css-loader!postcss-loader!stylus-loader')},
      {test: /\.styl$/, exclude: /styles/, loader: TextPlugin.extract('style-loader', 'css-loader?modules!postcss-loader!stylus-loader')},
      {test: /\.json/, loader: 'json-loader'},
      {test: /\.(eot|woff|woff2|ttf|pdf|png|jpg|jpeg|gif)$/, loader: 'file-loader?context=./app/&name=[path][name].[ext]'}
    ]
  },

  // postprocessor configuration
  postcss: [autoprefixer({browsers: ['last 5 versions']})],

  // stylus configuration
  stylus: {
    use: [rupture(), mixins()]
  },

  // plugins configurations
  plugins: [
    // vendors entry point
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.[chunkhash].js'),

    // move require('style.css') into a separate ccs files
    new TextPlugin('[name].[chunkhash].css'),

    // generate svg sprite
    new Svg(srcAbsoluteDir + '/vector/**/*.svg', '', {
      name: 'sprite.[hash].svg',
      chunk: 'application',
      prefix: '',
      svgoOptions: {
        convertStyleToAttrs: true
      }
    }),

    // provide libraries
    new webpack.ProvidePlugin({
      _: 'lodash',
      React: 'react',
      ReactDOM: 'react-dom',
      moment: 'moment'
    }),

    // generate index.html
    new HtmlPlugin({
      url: config.host,
      title: config.title,
      description: config.description,
      chunks: ['application', 'vendors'],
      filename: '../index.html',
      template: './app/templates/index.jade'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),

    new CopyWebpackPlugin([{
      from: path.join(srcAbsoluteDir, 'favicons'),
      to: path.join(destAbsoluteDir, 'favicons')
    }])
  ]
};
