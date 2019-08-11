'use strict';

const { resolve, apiNames } = require('../util');

function configure(input, output) {
  const isDIR = Array.isArray(input);
  return {
    inputOptions: {
      input,
      external: (id) => {
        return /^celia/.test(id);
      }
    },
    outputOptions: {
      dir: isDIR ? output : undefined,
      file: isDIR ? undefined : output,
      format: 'es'
    }
  };
}

module.exports = [
  configure(apiNames.map(dir => resolve(`src/${dir}.js`)), resolve(`npm/es`)),
  configure(resolve('src/plugins/logger'), resolve(`npm/logger.es.js`))
];
