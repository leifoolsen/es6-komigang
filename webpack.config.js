//require('./node_modules/es6-promise'); // Not needed for Node v4
var path = require('path');

module.exports = {
  debug: true,
  devtool: 'source-map', // 'source-map' or "inline-source-map" or 'eval-source-map'
  entry: [
    path.join(__dirname, 'src/main.scss'), // Styles
    'babel-polyfill',                      // Set up an ES6-ish environment
    path.join(__dirname, './src/main.js')  // Application's scripts
  ],
  output: {
    publicPath: '/',
    path: __dirname,
    filename: '/bundle/bundle.js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
  },
  module: {
    preLoaders: [
      {
        test: /\.js[x]?$/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'test')
        ],
        //exclude: /(node_modules|bower_components)/,
        loaders: ['eslint']
      }
    ],
    loaders: [
      {
        test: /\.js[x]?$/,                        // Only run `.js` and `.jsx` files through Babel
        include: path.resolve(__dirname, "src"),  // Skip any files outside of your project's `src` directory
        loader: 'babel-loader',
        query: {                                  // Options to configure babel with
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.scss$/,
        include: path.join(__dirname, 'src'),
        loaders: ['style', 'css?sourceMap', 'autoprefixer?browsers=last 3 versions', 'sass?expanded&sourceMap']
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src'),
        //exclude: /(node_modules|bower_components)/,
        loaders: ['style', 'css?sourceMap', 'autoprefixer']
      },
      {
        // inline base64 URLs for <=16k images, direct URLs for the rest
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          limit: 16384
        }
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
