const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { override, addWebpackAlias, fixBabelImports } = require('customize-cra');
const { RewiredRule } = require('chain-css-loader');
const { DefinePlugin } = require('webpack');

function resolve() {
  return path.join(__dirname, ...arguments);
}

const examplePath = resolve('examples');
const appBuild = resolve('examples/dist');
const appIndexJs = resolve('examples/app.js');
const appHtml = resolve('examples/public/index.html');
const appPublic = resolve('examples/public');

const entries = {
  index: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    appIndexJs
  ]
};
const htmls = [new HtmlWebpackPlugin({
  chunks: ['index'],
  inject: true,
  template: appHtml,
  filename: 'index.html'
})];
const rewrites = [];

fs.readdirSync(examplePath).forEach((dir) => {
  const fullDir = path.join(examplePath, dir);
  const entry = path.join(fullDir, 'app.js');

  if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
    entries[dir] = [
      require.resolve('react-dev-utils/webpackHotDevClient'),
      entry
    ];

    htmls[htmls.length] = new HtmlWebpackPlugin({
      chunks: [dir],
      inject: true,
      template: appHtml,
      filename: `${dir}.html`
    });

    rewrites[rewrites.length] = {
      from: new RegExp(`^/${dir}(/\\w+)*$`),
      to: `/${dir}.html`
    };
  }
});

module.exports = {
  webpack(config, env) {
    return override(
      addWebpackAlias({
        '~': examplePath
      }),
      fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: 'css'
      }),
      function (conf) {
        // 修改多页
        config.entry = entries;
        config.output.filename = 'static/js/[name].bundle.js';
        const plugins = config.plugins.slice(1);
        config.plugins = htmls.concat(plugins);

        // 添加 DefinePlugin 插件
        conf.plugins = (conf.plugins || []).concat([new DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(env)
        })]);

        // 添加 stylus 支持，如果不需要可去掉
        const rule = new RewiredRule(conf);
        rule.useStylus();
        return conf;
      }
    )(config);
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.historyApiFallback.rewrites = rewrites;
      return config;
    };
  },
  paths: function (paths) {
    paths.appSrc = examplePath;
    paths.appIndexJs = appIndexJs;
    paths.appBuild = appBuild;
    paths.appPublic = appPublic;
    paths.appHtml = appHtml;
    return paths;
  }
};
