'use strict';

const _ = require('lodash');
const settings = require('./../defaults');
const root = process.env.PWD;

module.exports = _.merge(settings, {
  context: root,
  debug: true,
  devtool: 'eval',

  output: {
    publicPath: '/'
  },

  devServer: {
    outputPath: settings.output.path,
    contentBase: root + '/app',
    historyApiFallback: true
  }
});
