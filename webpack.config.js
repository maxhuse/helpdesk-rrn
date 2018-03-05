const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// extract sourceMap only in production
const sourceMapType = process.env.NODE_ENV === 'production' ?
  'source-map' :
  'eval-source-map';

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new ExtractTextPlugin({
    filename: 'styles.css',
    disable: process.env.NODE_ENV === 'hot'
  }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru|en/)
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.LoaderOptionsPlugin({ minimize: true }),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
  );
}

// HMR only on development
if (process.env.NODE_ENV === 'hot') {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  );
}

module.exports = {
  devtool: sourceMapType,
  watchOptions: {
    aggregateTimeout: 100
  },
  entry: process.env.NODE_ENV === 'hot' ?
    ['webpack-hot-middleware/client', './client/index'] :
    './client/index',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  plugins: plugins,
  resolve: {
    modules: [
      path.join(__dirname, 'client'),
      "node_modules"
    ],
    alias: { shared: path.join(__dirname, 'shared') },
    extensions: ['.js', '.jsx']
  },
  node: { constants: false },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'postcss-loader', options: { sourceMap: true } },
            { loader: 'resolve-url-loader', options: { sourceMap: true } },
            { loader: 'sass-loader', options: { sourceMap: true } },
          ]
        })
      },
      {
        test: /\.(png|jpg|ttf|otf|eot|svg|woff|woff2|ico)$/,
        use: [{
          loader: 'file-loader',
          options: { name: '[name].[ext]' }
        }]
      }
    ]
  }
};
