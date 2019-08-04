'use strict';

const { promisify } = require('util');
const { existsSync, mkdirSync } = require('fs');
const { copy } = require('fs-extra');
const { resolve } = require('./util');

const copify = promisify(copy);

module.exports = () => {
  const distDir = resolve('npm');
  if (!existsSync(distDir)) {
    mkdirSync(distDir);
  }
  return Promise.all([
    copify(resolve('package.json'), resolve('npm/package.json')),
    copify(resolve('README.md'), resolve('npm/README.md'))
    // copify(resolve('src'), resolve('npm/es'))
  ]);
};
