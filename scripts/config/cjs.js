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
      format: 'cjs',
      legacy: false,
      esModule: false,
      interop: false
    }
  };
}

module.exports = [
  configure(apiNames.map(dir => resolve(`src/${dir}.js`)), resolve(`npm`)),
  configure(resolve('src/plugins/logger'), resolve(`npm/logger.js`))
];
