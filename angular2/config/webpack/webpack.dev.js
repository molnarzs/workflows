"use strict";
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const commonConfig = require('./webpack.common.js');
const constants = require('./constants');
const helpers = require('./helpers');

let polyfillsManifest;
let vendorManifest;
const isProd = process.env.npm_lifecycle_event === 'build';

try {
  polyfillsManifest = require(helpers.systemRoot(constants.DLL_DIST, 'polyfills-manifest.json'));
  vendorManifest = require(helpers.systemRoot(constants.DLL_DIST, 'vendorDll-manifest.json'));
} catch (e) {
  throw 'Please rebuild DLL first by running `npm run build:dll`';
}

var config = webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: 'http://localhost:8081/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  module: {
    rules: [{
        test: /\.ts$/,
        loaders: 'awesome-typescript-loader',
        query: {
          forkChecker: true
        },
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.ts$/,
        loaders: [
          'angular2-template-loader',
          '@angularclass/hmr-loader'
        ],
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.ts$/,
        loaders: [
          'angular2-router-loader?loader=system&genDir=src&aot=' + isProd
        ],
        exclude: [
          /node_modules/
        ]
      }
    ]
  },

  plugins: [
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: polyfillsManifest
    }),
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: vendorManifest
    }),
    new AddAssetHtmlPlugin([
      { filepath: constants.DLL_DIST + '/polyfills.dll.js', includeSourcemap: false },
      { filepath: constants.DLL_DIST + '/vendorDll.dll.js', includeSourcemap: false }
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    })
  ],

  devServer: {
    hot: true,
    contentBase: '/app/project/src/public',
    historyApiFallback: true,
    stats: 'minimal'
  }
});

module.exports = config;
