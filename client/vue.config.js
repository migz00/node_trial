const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, '../server/public'),
  transpileDependencies: [
    'vuetify',
  ],
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000'
      },
      '/insert': {
        target: 'http://localhost:4000'
      }
    }
  }
};
