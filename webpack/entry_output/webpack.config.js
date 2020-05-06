const path = require('path');
const distPath = path.resolve(__dirname, './dist');

module.exports = {
  entry: {
    hello: './src/hello.js',
    world: './src/world.js'
  },
  output: {
    path: distPath,
    filename: '[name].js'
  }
};
