'use strict';

const { readdirSync } = require('fs');
const { join, basename } = require('path');
const { remove } = require('fs-extra');
const { getLogger } = require('clrsole');
const cp = require('./cp');
const { buildSrc, resolve, genConfig, apiNames } = require('./util');

const logger = getLogger(basename(__filename, '.js'));

/**
 * 获取所有的配置
 */
function getAllBuilds() {
  let mods = [];
  readdirSync(join(__dirname, 'config'))
    .forEach((key) => {
      key = key.replace(/\.js$/, '');
      require(`./config/${key}`)
        .forEach((config) => {
          mods[mods.length] = genConfig(key, config);
        });
    });
  return mods;
};

let builds = getAllBuilds();
if (process.argv[2]) {
  const filters = process.argv[2].split(',');
  builds = builds.filter((b) => {
    return filters.some(f => b._name.indexOf(f) > -1);
  });
}

/**
 * 编译所有的js
 * @param {Array} builds 配置数组
 */
async function build(builds) {
  await remove(resolve('npm'));
  logger.info('directory npm has been removed');

  const total = builds.length;
  for (let i = 0; i < total; i++) {
    try {
      await buildSrc(builds[i]);
    } catch (e) {
      logger.error(e);
      break;
    }
  }

  apiNames
    .forEach((dir) => {
      dir.startsWith('_') || dir === 'index' || console.log('-', dir);
    });
  await cp().catch((err) => {
    logger.error(err);
  });
}

build(builds);
