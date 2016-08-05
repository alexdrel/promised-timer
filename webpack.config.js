var webpack = require("webpack");

module.exports = {
  entry: {
    "index": "index.ts",
  },
  output: {
    path: 'build/',
    filename: '[name].js',
    //libraryTarget: "commonjs"
  },
  resolve: {
    extensions: ['', '.js', '.ts', '.tsx'],
    modulesDirectories: [ 'src', 'examples', 'node_modules' ],
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts' }
    ]
  },
  progress: true,
  devtool: "sourcemap"
};
