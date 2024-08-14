const path = require('path');

module.exports = {
  entry: './public/js/index.js', // Entry point should be your main JS file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // Add more loaders as needed for other file types
    ],
  },
  devtool: 'source-map',
  watch: false,
};
