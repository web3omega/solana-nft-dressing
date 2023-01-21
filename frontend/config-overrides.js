const { ProvidePlugin } = require('webpack');

module.exports = function (config, env) {
    return {
        ...config,
        module: {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                    test: /\.(m?js|ts)$/,
                    enforce: 'pre',
                    use: ['source-map-loader'],
                },
                {
                    test: /\.ttf$/,
                    use: {
                        loader: 'file-loader',
                        options: { 
                            name: '[name].[ext]',
                            useRelativePath: true
                        }
                    }
                },
            ],
            
        },
        plugins: [
            ...config.plugins,
            new ProvidePlugin({
                process: 'process/browser',
            }),
        ],
        resolve: {
            ...config.resolve,
            fallback: {
                assert: require.resolve('assert'),
                buffer: require.resolve('buffer'),
                stream: require.resolve('stream-browserify'),
                crypto: require.resolve('crypto-browserify'),
                zlib: require.resolve('browserify-zlib'),
                path: require.resolve('path-browserify')
            },
        },
        ignoreWarnings: [/Failed to parse source map/],
      
    };
};