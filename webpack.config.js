//require('./node_modules/es6-promise'); // Not needed for Node v4
var path = require('path');

module.exports = {
  devtool: 'eval-source-map',
  debug: true,
  entry: [
    './src/main.js'
  ],
  output: {
    publicPath: '/',
    path: __dirname,
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
  },
  module: {
      preLoaders: [
        {
          test: /\.js[x]?$/,
          //include: path.join(__dirname, 'src'),
          exclude: /(node_modules|bower_components)/,
          loaders: ['eslint']
        }
      ],
      loaders: [
      {
        test: /\.js[x]?$/,
        //include: path.join(__dirname, 'src'),
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, 'src'),
        loaders: ['style', 'css', 'sass', 'autoprefixer']
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src'),
        //exclude: /(node_modules|bower_components)/,
        loaders: ['style', 'css', 'autoprefixer']
      }
    ]
  },
  devServer: {
    contentBase: './src'
  },
  eslint: {
    // See: http://eslint.org/docs/user-guide/configuring.html
    // See: https://gist.github.com/nkbt/9efd4facb391edbf8048
    'parser': 'babel-eslint',
    'env': {
      'browser': true,
      'node': true,
      'es6': true
    },
    'settings': {
      'ecmascript': 7,
      'jsx': true
    },
    'rules': {
      'strict': 0,
      'no-unused-vars': 2,
      'camelcase': 1,
      'no-underscore-dangle': 1,
      'indent': [1, 2],
      'quotes': 0,
      'linebreak-style': [2, 'unix'],
      'semi': [2, 'always']
    }
  }
};
