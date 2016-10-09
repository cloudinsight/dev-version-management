module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: 'dist',
    filename: 'bundle.js',
    publicPath: 'dist'
  },
  module: {
    loaders: [
      {
        test: /.js/,
        loader: 'babel'
      }
    ]
  }
}
