# 热重载

使用 webpack 的 [Hot Module Replacement API](https://webpack.js.org/guides/hot-module-replacement/)，redux-sam 支持在开发过程中热重载 mutation、module和action。你也可以在 Browserify 中使用 [browserify-hmr](https://github.com/Macil/browserify-hmr) 插件。

对于 mutation 和模块，你需要使用 store.hotUpdate() 方法：

```js
// store.js
import { createStore, applyMiddleware } from 'redux';
import { Sam, reducer, middleware } from 'redux-sam';
import mutations from './mutations'
import moduleA from './modules/a'

const state = { ... }

const sam = new Sam({
  state,
  mutations,
  modules: {
    a: moduleA
  }
})
const store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));

if (module.hot) {
  // 使 action 和 mutation 成为可热重载模块
  module.hot.accept(['./mutations', './modules/a'], () => {
    // 获取更新后的模块
    // 因为 babel 6 的模块编译格式问题，这里需要加上 `.default`
    const newMutations = require('./mutations').default
    const newModuleA = require('./modules/a').default
    // 加载新模块
    sam.hotUpdate({
      mutations: newMutations,
      modules: {
        a: newModuleA
      }
    })
  })
}

```

参考热重载示例 counter-hot。
