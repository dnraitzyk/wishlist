const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
console.log("__dirname", __dirname)
module.exports = {
  context: path.resolve(__dirname, 'frontend'),

  output: {
    path: path.resolve(__dirname, 'build'),
    // path: path.resolve(__dirname, 'frontend', 'build'),
    filename: '[name].bundle.js',
    // clean: true,
  },
  devtool: "source-map",
  devServer: {
    static: './frontend/build/',
    hot: true,
    // devMiddleware: {
    //   publicPath: 'auto',
    //   // writeToDisk: true,
    // }
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
    }),
  ],
};