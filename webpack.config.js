const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
console.log("__dirname", __dirname)
module.exports = {
  context: path.resolve(__dirname, 'frontend'),

  output: {
    path: path.resolve(__dirname, 'build'),
    // path: path.resolve(__dirname, 'frontend', 'build'),
    filename: '[name].bundle.js',
    clean: true,
    publicPath: '/',
  },
  devtool: "source-map",
  devServer: {
    static: './build/',
    hot: true,
    devMiddleware: {
      publicPath: '/',
      writeToDisk: true,
    }
  },
  resolve: {
    modules: [path.resolve(__dirname, 'frontend', 'src'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/i,
        use: {
          loader: "html-loader",
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './frontend/src/images/[hash]-[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'frontend', 'src') + '/index.html',
      // template: path.resolve(__dirname, 'frontend', 'src') + '/index.js',
    }),
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'frontend', 'src') + '/error.html',
      filename: 'error.html',
      // template: path.resolve(__dirname, 'frontend', 'src') + '/index.js',
    }),
    new webpack.EnvironmentPlugin({
      REACT_APP_BASE_URL: 'http://localhost:5000',
    })
  ],
};