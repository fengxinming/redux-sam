const { join } = require('path');
const { override, addWebpackAlias, fixBabelImports } = require('customize-cra');
const { RewiredRule } = require('chain-css-loader');

const resolve = (dir) => join(__dirname, dir);

module.exports = {
  webpack(config, env) {
    return override(
      addWebpackAlias({
        '~': resolve('src')
      }),
      fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css'
      }),
      function (conf) { // 添加 stylus 支持，如果不需要可去掉
        const rule = new RewiredRule(conf);
        rule.useStylus();
        return conf;
      }
    )(config);
  }
};
