# react-redux
> 基于 [create-react-app](https://github.com/facebook/create-react-app) 构建的 react+redux demo

---

## 快速生成React项目

有三种方式
* npx (npm 5.2+)
```
  npx create-react-app my-app
```
* npm (npm 6+)
```
  npm create react-app my-app
```
* yarn (yarn 0.25+)
```
  yarn create react-app my-app
```
<p align='center'>
  <img src='https://cdn.rawgit.com/facebook/create-react-app/27b42ac/screencast.svg' width='600' alt='npm start'>
</p>

---

## 自定义webpack配置

一般有两种方式扩展内置的webpack配置：
* 在命令行中执行 `npm run eject`，内置的webpack配置将被导出，但是该操作不可逆，后续升级webpack需要自己完成；
* 借助第三方包 `react-app-rewired` 代替 `react-scripts` 执行项目打包构建等操作。

本次主要介绍第二种方式扩展webpack配置
* 安装第三方模块 react-app-rewired；
```
  yarn install react-app-rewired --dev
```
* 修改 package.json 中的 scripts 节点；
```js
{
  "scripts": {
    "dev": "react-app-rewired start", // instead of "react-scripts start"
    "build": "react-app-rewired build", // instead of "react-scripts build"
    "test": "react-app-rewired test",   // instead of "react-scripts test"
  },
}
```
* 安装第三方模块 customize-cra、babel-plugin-import、less、less-loader、chain-css-loader、stylus 和 stylus-loader；
```
  yarn add customize-cra babel-plugin-import --dev
```
* 新建js配置文件 config-overrides.js，扩展额外 webpack 配置（如果不使用stylus，可以不添加stylus支持）；
```js
const { join } = require('path');
const { override, addWebpackAlias, fixBabelImports, addLessLoader } = require('customize-cra');
const { RewiredRule } = require('chain-css-loader');

const resolve = (dir) => join(__dirname, '.', dir);

module.exports = function (config, env) {
  return override(
    addWebpackAlias({
      '~': resolve('src')
    }),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css'
    }),
    addLessLoader({
      // less-loader 的额外配置
    }),
    function (conf) { // 添加 stylus 支持，如果不需要可去掉
      const rule = new RewiredRule(conf);
      rule.useStylus();
      return conf;
    }
  )(config);
};
```

---

## 自定义目录结构

```
--
|- components 组件
|- constants 常量
|- lib 暂时实现了一个跟Vuex类似的redux插件
|- routes 自定义路由配置文件
|- store 自定义state、mutation和action
|- utils 常用工具
|- views 路由对应的视图页面
|- configure-store.js 创建redux store
|- history.js 客户端路由
|- index.jsx 入口文件
|- index.styl 全局样式
|- router.jsx 处理自定义路由配置
|- serviceWorker.js 脚手架提供的sw注册和注销方法
```

暂时实现了一个登录demo，启动开发服务
```
npm run dev
```

## 注意事项
* 直接使用redux时，一定要在reducer中返回新对象才能触发组件connect方法中的回调方法
