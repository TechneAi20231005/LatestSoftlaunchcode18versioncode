const config = process.env.REACT_APP_STAGE === 'production' ? prod : dev;

//   export default {
//     // Add common config values here
//     MAX_ATTACHMENT_SIZE: 5000000,
//     ...config
//   };
module.exports = {
  module: {
    loaders: [
      {
        test: /plugin\.css$/,
        loaders: ['style-loader', 'css']
      }
    ]
  }
};

// webpack.config.js

module.exports = {
  // ...
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};
