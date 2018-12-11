'use strict';

const _ = require('lodash');
const webpack = require('webpack');
const settings = require('./../defaults');
const root = process.env.PWD;

settings.plugins.push(new webpack.optimize.UglifyJsPlugin());

module.exports = _.merge(settings, {
  context: root,
  debug: false,
  devtool: 'cheap-source-map'
});
