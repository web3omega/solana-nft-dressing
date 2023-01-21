const path = require('path')
const Dotenv = require('dotenv-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = function webpackConfig(env, args) {
  return {
    entry: path.join(__dirname, 'src/index.tsx'),
    output: {
      filename: 'main.js',
      path: path.join(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      plugins: [new TsconfigPathsPlugin()],
      fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer"),
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          // See .babelrc for further babel config
        },
      ],
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    optimization: {
      minimizer: [
        new (require('terser-webpack-plugin'))({ extractComments: false }),
      ],
    },
    devServer: {
      hot: true,
      open: true,
      historyApiFallback: true,
      static: { directory: path.join(__dirname, 'public') },
    },
    plugins: [
      new Dotenv({
        path: `./.env.${env.production ? 'production' : 'development'}.local`
      }),
      new CopyWebpackPlugin({
        patterns: [
          {from: 'public', to: '.', force: true}
        ],
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
          process: 'process/browser',
      }),
    ]
  };
}