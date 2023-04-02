const path = require('path');
const webpack = require('webpack');

module.exports = function override(config) {
    console.log('override')
    let loaders = config.resolve
    loaders.fallback = {
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        os: require.resolve('os-browserify/browser'),
    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        }),
    );
    config.resolve = {
        ...config.resolve,
        alias: {
            ...config.resolve.alias,
            '@components': path.resolve(__dirname, 'src/components'),
        },
    };
    
    return config
}