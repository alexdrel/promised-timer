// Karma configuration
var webpack_config = require("./webpack.config");

module.exports = function(config) {
    config.set({
        // ... normal karma configuration
        basePath: '',
        frameworks: ['jasmine'],

        files: [
            // all files ending in "_test"
            'tests/*_test.*',
            'tests/**/*_test.*'
            // each file acts as entry point for the webpack configuration
        ],

        preprocessors: {
            // add webpack as preprocessor
            'tests/*_test.*': ['webpack', 'sourcemap'],
            'tests/**/*_test.*': ['webpack', 'sourcemap']
        },

        port: 8065,
        logLevel: config.LOG_INFO,
        colors: true,
        autoWatch: true,

        browsers: ['Chrome'],
        reporters: ['progress'],
        captureTimeout: 60000,
        singleRun: false,

        webpack: {
          cache: true,
          devtool: 'inline-source-map',

          resolve: webpack_config.resolve,
          module: webpack_config.module,
          externals: webpack_config.externals,
        },
        webpackMiddleware: {
            noInfo: true
        }
    });
};
