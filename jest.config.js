'use strict';

module.exports = {
  roots: [
    'tests'
  ],
  verbose: false,
  testEnvironment: 'node',
  // testEnvironment: 'jsdom',
  testRegex: 'tests/(.*/)*.*test.js$',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: ['/node_modules/']
};
