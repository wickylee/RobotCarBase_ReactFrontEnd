const path = require('path');
const webpack = require('webpack');
const HWP = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
   entry: path.join(__dirname, '/src/index.js'),
    output: {
       filename: 'bundle.js',
       path: path.join(__dirname, '/public')},
    devServer: {
        publicPath: 'http://locahost:8080',
        inline: true,
        // contentBase: __dirname + "/public/assets/", 
        host: '0.0.0.0',
        port: 8080,
      },
    // context: path.resolve(__dirname),
    plugins: [
        new MiniCssExtractPlugin({filename: "./css/main.css"}) ,
        new HWP(
            {template: path.join(__dirname,'/src/index.html'),
            minify: false}
         )
      ],
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
            loader: "babel-loader"
            }
          },
          {
            test: /\.module\.s(a|c)ss$/,
            loader: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: true
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  modules: true
                }
              }
            ]
          },
          {
            test: /\.s(a|c)ss$/,
            exclude: /\.module.(s(a|c)ss)$/,
            loader: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'sass-loader',
                options: {
                  modules: true
                }
              }
            ]
          },
          {
            test: /\.(ttf|eot|svg)$/,
            use: {
              loader: "file-loader",
              options: {
                name: "[hash].[ext]",
                outputPath: './css/fonts/',
                publicPath: 'fonts/'
              }
            }
          },
          {
            test: /\.(woff|woff2)$/,
            use: {
              loader: "url-loader",
              options: {
                name: "[hash].[ext]",
                outputPath: './css/fonts/',
                publicPath: 'fonts/',
                limit: 5000,
                mimetype: "application/font-woff"
              }
            }
          }
        ]
      },
      resolve: {
        extensions: ["*", ".js", ".jsx", '.scss']
      }
}