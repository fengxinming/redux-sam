'use strict';

const { resolve } = require('../util');

function configure(input, output, name) {
  return {
    isProd: true,
    inputOptions: {
      input
    },
    outputOptions: {
      name: name || 'reduxSam',
      file: output,
      format: 'iife',
      legacy: false,
      esModule: false
    }
  };
}

module.exports = [
  configure(resolve('src/index.js'), resolve(`npm/iife.js`)),
  configure(resolve('src/plugins/logger'), resolve(`npm/logger.iife.js`), 'createSamLogger')
];
