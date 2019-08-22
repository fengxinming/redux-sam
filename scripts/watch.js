'use strict';

const { getLogger } = require('clrsole');
const rollup = require('rollup');
const { copy } = require('fs-extra');
const { genConfig, resolve } = require('./util');

const logger = getLogger('redux-sam');
const esConfig = genConfig('es', {
  inputOptions: {
    input: [resolve('src/index.js'), resolve('src/plugins/logger.js')],
    external: (id) => {
      return /^celia/.test(id);
    }
  },
  outputOptions: {
    dir: resolve(`examples/login/src/redux-sam`),
    format: 'es'
  }
});

function watch() {
  const watchOptions = {
    ...esConfig.inputOptions,
    output: [esConfig.outputOptions]
  };
  const watcher = rollup.watch(watchOptions);

  watcher.on('event', (evt) => {
    // evt.code can be one of:
    //   START        — the watcher is (re)starting
    //   BUNDLE_START — building an individual bundle
    //   BUNDLE_END   — finished building a bundle
    //   END          — finished building all bundles
    //   ERROR        — encountered an error while bundling
    //   FATAL        — encountered an unrecoverable error
    const {
      code,
      input,
      output
    } = evt;
    switch (code) {
      case 'START':
        logger.info(`开始监听 ...`);
        break;
      case 'BUNDLE_START':
        logger.info(`开始打包 ${input} ...`);
        break;
      case 'BUNDLE_END':
        output.forEach((n) => {
          logger.info(`打包完成 ${n}`);

          const chat = `examples/chat/src/redux-sam`;
          copy(n, resolve(chat)).then(() => {
            logger.info(`复制 ${chat} 成功`);
          });

          const counter = `examples/counter/src/redux-sam`;
          copy(n, resolve(counter)).then(() => {
            logger.info(`复制 ${counter} 成功`);
          });

          const counterHot = `examples/counter-hot/src/redux-sam`;
          copy(n, resolve(counterHot)).then(() => {
            logger.info(`复制 ${counterHot} 成功`);
          });

          const shoppingCart = `examples/shopping-cart/src/redux-sam`;
          copy(n, resolve(shoppingCart)).then(() => {
            logger.info(`复制 ${shoppingCart} 成功`);
          });

          const start = `examples/start/src/redux-sam`;
          copy(n, resolve(start)).then(() => {
            logger.info(`复制 ${start} 成功`);
          });

          const todomvc = `examples/todomvc/src/redux-sam`;
          copy(n, resolve(todomvc)).then(() => {
            logger.info(`复制 ${todomvc} 成功`);
          });
        });
        break;
      case 'END':
        logger.info('打包结束 ...');
        break;
      case 'ERROR':
        logger.error('打包异常:', input, '\n', evt.error);
        break;
      case 'FATAL':
        logger.error('未知异常:', evt.error);
        break;
    }
  });
}

watch();
