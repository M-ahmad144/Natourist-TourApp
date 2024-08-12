const path = require('path');

module.exports = {
  entry: './public/js',
  output: {
    filename: 'bundle.js', // The output file name
    path: path.resolve(__dirname, 'public/js'), // The output directory
  },
  mode: 'development', // Set to 'production' for optimized builds
  module: {
    rules: [
      {
        test: /\.js$/, // Apply Babel loader to JavaScript files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/, // Apply CSS loaders
        use: ['style-loader', 'css-loader'],
      },
      // Add more loaders as needed for other file types (e.g., images, fonts)
    ],
  },
  devtool: 'source-map', // Optional: generates source maps for debugging
  watch: false, // Use this to override the watch mode in your script
};
