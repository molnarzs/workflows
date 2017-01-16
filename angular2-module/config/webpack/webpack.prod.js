const webpack = require('webpack');
const path = require('path');
const webpackMerge = require('webpack-merge');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ngtools = require('@ngtools/webpack');

const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

var config = webpackMerge(commonConfig, {
  devtool: 'source-map',

  module: {
    rules: [{
      enforce: 'post',
      test: /\.ts$/,
      loaders: ['@ngtools/webpack'],
      exclude: [/\.(spec|e2e)\.ts$/]
    }]
  },

  output: {
    path: helpers.systemRoot('dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  plugins: [
    new webpack.NoErrorsPlugin(),

    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      allChunks: true
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [require('postcss-cssnext')],
        htmlLoader: {
          minimize: false // workaround for ng2
        }
      }
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
});

config.entry = {
  'style': '/app/project/src/app/styles/index.ts'
};

module.exports = config;