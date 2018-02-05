var webpack = require("webpack");

module.exports = {
  entry: {
    "index": "./examples/index.ts",
  },
  output: {
    path: __dirname +'/build/',
    filename: '[name].js',
    //libraryTarget: "commonjs"
  },
  resolve: {
    extensions: [ '.js', '.ts', '.tsx'],
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  },
  devtool: "source-map"
};
