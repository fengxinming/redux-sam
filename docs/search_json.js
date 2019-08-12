window.ydoc_plugin_search_json = {
  "文档": [
    {
      "title": "redux-sam",
      "content": "redux-sam 作为一个 Redux 中间件，让你像使用Vuex一样管理状态。\n笔者是一位 Vue 患者，从深圳来到杭州之后，发现 React 一直占据着杭州市场。最近在接手老项目过程中发现，前人对 Dva 的使用方式跟Vuex类似，除了每次在reducer最后返回新对象。笔者在思考能不能像 Vuex 一样简单而纯粹地管理状态，而不是像 Dva 一样在 redux-saga 上进行二次封装。因此，在借(chao)鉴(xi) Vuex 的代码之后，孕育出了一个 Redux 中间件 redux-sam。以下是一个表示“单向数据流”理念的简单示意：",
      "url": "/guide/index.html",
      "children": []
    },
    {
      "title": "安装",
      "content": "npm install --save redux-sam\n\n或者通过 script 方式加载\n  // window.reduxSam\n  reduxSam.Sam\n  reduxSam.middleware\n  reduxSam.reducer\n\n\n\n  // window.createSamLogger\n\n\n",
      "url": "/guide/installation.html",
      "children": []
    },
    {
      "title": "引言",
      "content": "每一个 redux-sam 应用的核心就是 store（仓库）。“store”基本上就是一个容器，它包含着你的应用中大部分的状态 (state)，你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation，这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。",
      "url": "/guide/intro.html",
      "children": [
        {
          "title": "最简单的 Store",
          "url": "/guide/intro.html#最简单的-store",
          "content": "最简单的 Store安装 redux-sam 之后，让我们来创建一个 store。创建过程直截了当——仅需要提供一个初始 state 对象和一些 mutation：import { createStore, applyMiddleware } from 'redux';import { Sam, reducer, middleware } from 'redux-sam';\n\nconst sam = new Sam({\n  state: {\n    count: 0\n  },\n  mutations: {\n    increment (state) {\n      state.count++\n    }\n  }\n});\n\nconst store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));\n\n现在，你可以通过 sam.state or store.getState() 来获取状态对象，以及通过 store.dispatch 方法触发状态变更：store.dispatch('increment')\nconsole.log(store.getState().count) // -> 1\n\n或者sam.commit('increment')\nconsole.log(sam.state.count) // -> 1\n\n再次强调，我们通过提交 mutation 的方式，而非直接改变 store.getState().count，是因为我们想要更明确地追踪到状态的变化。这个简单的约定能够让你的意图更加明显，这样你在阅读代码的时候能更容易地解读应用内部的状态改变。此外，这样也让我们有机会去实现一些能记录每次状态改变，保存状态快照的调试工具。有了它，我们甚至可以实现如时间穿梭般的调试体验。"
        }
      ]
    },
    {
      "title": "核心概念",
      "content": "state\nmutation\naction\nmodules\n",
      "url": "/guide/core.html",
      "children": []
    },
    {
      "title": "State",
      "content": "",
      "url": "/guide/state.html",
      "children": [
        {
          "title": "单一状态树",
          "url": "/guide/state.html#单一状态树",
          "content": "单一状态树redux-sam 使用单一状态树——是的，用一个对象就包含了全部的应用层级状态。至此它便作为一个“唯一数据源 (SSOT)”而存在。这也意味着，每个应用将仅仅包含一个 store 实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。单状态树和模块化并不冲突——在后面的章节里我们会讨论如何将状态和状态变更事件分布到各个子模块中。"
        },
        {
          "title": "在 React 组件中获得 redux 状态",
          "url": "/guide/state.html#在-react-组件中获得-redux-状态",
          "content": "在 React 组件中获得 redux 状态那么我们如何在 React 组件中展示状态呢？通过connect方法把state中的值作为属性传入组件：// 创建一个 Counter 组件class Counter extends Component {\n  render() {\n    return (\n      {this.props.count}\n    );\n  }\n}\nexport default connect(state => { count: state.count })(Counter);\n\n每当 getState().count 变化的时候, 都会重新求取计算属性，并且触发更新相关联的 DOM。"
        }
      ]
    },
    {
      "title": "Mutation",
      "content": "更改 redux-sam 的 state 的唯一方法是提交 mutation。redux-sam 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：import { createStore, applyMiddleware } from 'redux';import { Sam, reducer, middleware } from 'redux-sam';\nconst sam = new Sam({\n  state: {\n    count: 1\n  },\n  mutations: {\n    increment (state) {\n      // 变更状态\n      state.count++\n    }\n  }\n})\nconst store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));\n\n你不能直接调用一个 mutation handler。这个选项更像是事件注册：“当触发一个类型为 increment 的 mutation 时，调用此函数。”要唤醒一个 mutation handler，你需要以相应的 type 调用 store.dispatch 方法：store.dispatch('increment')\n或者sam.commit('increment')\n",
      "url": "/guide/mutations.html",
      "children": [
        {
          "title": "提交载荷（Payload）",
          "url": "/guide/mutations.html#提交载荷（payload）",
          "content": "提交载荷（Payload）你可以向 store.dispatch 传入额外的参数，即 mutation 的 载荷（payload）：// ...mutations: {\n  increment (state, n) {\n    state.count += n\n  }\n}\n\nstore.dispatch('increment', 10)\n或者sam.commit('increment', 10)\n在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读：// ...mutations: {\n  increment (state, payload) {\n    state.count += payload.amount\n  }\n}\n\nstore.dispatch('increment', {  amount: 10\n})\n\n或者sam.commit('increment', {  amount: 10\n})\n\n"
        },
        {
          "title": "对象风格的提交方式",
          "url": "/guide/mutations.html#对象风格的提交方式",
          "content": "对象风格的提交方式提交 mutation 的另一种方式是直接使用包含 type 属性的对象：store.dispatch({  type: 'increment',\n  payload: {\n    amount: 10\n  }\n})\n\n或者sam.commit({  type: 'increment',\n  payload: {\n    amount: 10\n  }\n})\n\n当使用对象风格的提交方式，整个对象都作为载荷传给 mutation 函数，因此 handler 保持不变：mutations: {  increment (state, payload) {\n    state.count += payload.amount\n  }\n}\n\n"
        },
        {
          "title": "使用常量替代 Mutation 事件类型",
          "url": "/guide/mutations.html#使用常量替代-mutation-事件类型",
          "content": "使用常量替代 Mutation 事件类型使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：// mutation-types.jsexport const SOME_MUTATION = 'SOME_MUTATION'\n\n// store.jsimport { Sam, reducer, middleware } from 'redux-sam';\nimport { SOME_MUTATION } from './mutation-types'\n\nconst sam = new Sam({\n  state: { ... },\n  mutations: {\n    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名\n    [SOME_MUTATION] (state) {\n      // mutate state\n    }\n  }\n})\n\n用不用常量取决于你——在需要多人协作的大型项目中，这会很有帮助。但如果你不喜欢，你完全可以不这样做。"
        },
        {
          "title": "Mutation 必须是同步函数",
          "url": "/guide/mutations.html#mutation-必须是同步函数",
          "content": "Mutation 必须是同步函数一条重要的原则就是要记住 mutation 必须是同步函数。为什么？请参考下面的例子：mutations: {  someMutation (state) {\n    api.callAsyncMethod(() => {\n      state.count++\n    })\n  }\n}\n\n"
        },
        {
          "title": "下一步：Action",
          "url": "/guide/mutations.html#下一步：action",
          "content": "下一步：Action在 mutation 中混合异步调用会导致你的程序很难调试。例如，当你调用了两个包含异步回调的 mutation 来改变状态，你怎么知道什么时候回调和哪个先回调呢？这就是为什么我们要区分这两个概念。在 redux-sam 中，mutation 都是同步事务：store.dispatch('increment') // or sam.commit('increment')// 任何由 \"increment\" 导致的状态变更都应该在此刻完成。\n\n为了处理异步操作，让我们来看一看 Action。"
        }
      ]
    },
    {
      "title": "Action",
      "content": "Action 类似于 mutation，不同在于：Action 提交的是 mutation，而不是直接变更状态。\nAction 可以包含任意异步操作。\n让我们来注册一个简单的 action：import { createStore, applyMiddleware } from 'redux';import { Sam, reducer, middleware } from 'redux-sam';\nconst sam = new Sam({\n  state: {\n    count: 0\n  },\n  mutations: {\n    increment (state) {\n      state.count++\n    }\n  },\n  actions: {\n    increment (context) {\n      context.commit('increment')\n    }\n  }\n})\nconst store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));\n\nAction 函数接受一个与 sam 实例具有相同方法和属性的 context 对象，因此你可以调用 context.dispatch 提交一个 mutation，或者通过 context.state 来获取 state。当我们在之后介绍到 Modules 时，你就知道 context 对象为什么不是 sam 实例本身了。实践中，我们会经常用到 ES2015 的 参数解构 来简化代码（特别是我们需要调用 dispatch 很多次的时候）：actions: {  increment ({ commit }) {\n    commit('increment')\n  }\n}\n\n",
      "url": "/guide/actions.html",
      "children": [
        {
          "title": "分发 Action",
          "url": "/guide/actions.html#分发-action",
          "content": "分发 ActionAction 通过 sam.dispatch 方法触发：store.dispatch('increment', null, { async: true })\n或者sam.dispatch('increment')\n乍一眼看上去感觉多此一举，我们直接分发 mutation 岂不更方便？实际上并非如此，还记得 mutation 必须同步执行这个限制么？Action 就不受约束！我们可以在 action 内部执行异步操作：actions: {  incrementAsync ({ commit }) {\n    setTimeout(() => {\n      commit('increment')\n    }, 1000)\n  }\n}\n\nActions 支持同样的载荷方式和对象方式进行分发：// 以载荷形式分发store.dispatch('incrementAsync', {\n  amount: 10\n}, { async: true })\n\n// 以对象形式分发\nstore.dispatch({\n  type: 'incrementAsync',\n  payload: {\n    amount: 10\n  },\n  options: { async: true }\n})\n\n或者// 以载荷形式分发sam.dispatch('incrementAsync', {\n  amount: 10\n})\n\n// 以对象形式分发\nsam.dispatch({\n  type: 'incrementAsync',\n  payload: {\n    amount: 10\n  }\n})\n\n来看一个更加实际的购物车示例，涉及到调用异步 API 和分发多重 mutation：actions: {  checkout ({ commit, state }, products) {\n    // 把当前购物车的物品备份起来\n    const savedCartItems = [...state.cart.added]\n    // 发出结账请求，然后乐观地清空购物车\n    commit(types.CHECKOUT_REQUEST)\n    // 购物 API 接受一个成功回调和一个失败回调\n    shop.buyProducts(\n      products,\n      // 成功操作\n      () => commit(types.CHECKOUT_SUCCESS),\n      // 失败操作\n      () => commit(types.CHECKOUT_FAILURE, savedCartItems)\n    )\n  }\n}\n\n注意我们正在进行一系列的异步操作，并且通过提交 mutation 来记录 action 产生的副作用（即状态变更）。"
        },
        {
          "title": "在组件中分发 Action",
          "url": "/guide/actions.html#在组件中分发-action",
          "content": "在组件中分发 Action你在组件中使用 this.prop.dispatch('xxx') 分发 action，export default {  // ...\n  increment() {\n    this.prop.dispatch('increment')\n  }\n  incrementBy(amount) {\n    this.prop.dispatch('incrementBy', amount)\n  }\n}\n\n"
        },
        {
          "title": "组合 Action",
          "url": "/guide/actions.html#组合-action",
          "content": "组合 ActionAction 通常是异步的，那么如何知道 action 什么时候结束呢？更重要的是，我们如何才能组合多个 action，以处理更加复杂的异步流程？首先，你需要明白 store.dispatch 可以处理被触发的 action 的处理函数返回的 Promise，并且 store.dispatch 仍旧返回 Promise：actions: {  actionA ({ dispatch }) {\n    return new Promise((resolve, reject) => {\n      setTimeout(() => {\n        dispatch('someMutation')\n        resolve()\n      }, 1000)\n    })\n  }\n}\n\n现在你可以：store.dispatch('actionA', null, { async: true }).then(() => {  // ...\n})\n\n或者sam.dispatch('actionA').then(() => {  // ...\n})\n\n在另外一个 action 中也可以：actions: {  // ...\n  actionB ({ dispatch, commit }) {\n    return dispatch('actionA').then(() => {\n      commit('someOtherMutation')\n    })\n  }\n}\n\n最后，如果我们利用 async / await，我们可以如下组合 action：// 假设 getData() 和 getOtherData() 返回的是 Promise\nactions: {\n  async actionA ({ commit }) {\n    commit('gotData', await getData())\n  },\n  async actionB ({ dispatch, commit }) {\n    await dispatch('actionA', null, { async: true }) // 等待 actionA 完成\n    commit('gotOtherData', await getOtherData())\n  }\n}\n\n一个 store.dispatch 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。\n"
        }
      ]
    },
    {
      "title": "Module",
      "content": "由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。为了解决以上问题，redux-sam 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation和action、甚至是嵌套子模块——从上至下进行同样方式的分割：import { Sam, reducer, middleware } from 'redux-sam';\nconst moduleA = {\n  state: { ... },\n  mutations: { ... },\n  actions: { ... }\n}\n\nconst moduleB = {\n  state: { ... },\n  mutations: { ... },\n  actions: { ... }\n}\n\nconst sam = new Sam({\n  modules: {\n    a: moduleA,\n    b: moduleB\n  }\n})\n\nsam.state.a // -> moduleA 的状态\nsam.state.b // -> moduleB 的状态\n\n",
      "url": "/guide/modules.html",
      "children": [
        {
          "title": "模块的局部状态",
          "url": "/guide/modules.html#模块的局部状态",
          "content": "模块的局部状态对于模块内部的 mutation ，接收的第一个参数是模块的局部状态对象。const moduleA = {  state: { count: 0 },\n  mutations: {\n    increment (state) {\n      // 这里的 `state` 对象是模块的局部状态\n      state.count++\n    }\n  }\n}\n\n同样，对于模块内部的 action，局部状态通过 context.state 暴露出来，根节点状态则为 context.rootState：const moduleA = {  // ...\n  actions: {\n    incrementIfOddOnRootSum ({ state, commit, rootState }) {\n      if ((state.count + rootState.count) % 2 === 1) {\n        commit('increment')\n      }\n    }\n  }\n}\n\n"
        },
        {
          "title": "命名空间",
          "url": "/guide/modules.html#命名空间",
          "content": "命名空间默认情况下，模块内部的 action和mutation 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。如果希望你的模块具有更高的封装度和复用性，你可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。例如：import { Sam, reducer, middleware } from 'redux-sam';\nconst sam = new Sam({\n  modules: {\n    account: {\n      namespaced: true,\n\n      // 模块内容（module assets）\n      state: { ... }, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性\n      actions: {\n        login () { ... } // -> dispatch('account/login', null, { async: true })\n      },\n      mutations: {\n        login () { ... } // -> dispatch('account/login')\n      },\n\n      // 嵌套模块\n      modules: {\n        // 继承父模块的命名空间\n        myPage: {\n          state: { ... }\n        },\n\n        // 进一步嵌套命名空间\n        posts: {\n          namespaced: true,\n\n          state: { ... }\n        }\n      }\n    }\n  }\n})\n\n启用了命名空间的 action 会收到局部化的 dispatch 。换言之，你在使用模块内容（module assets）时不需要在同一模块内额外添加空间名前缀。更改 namespaced 属性后不需要修改模块内的代码。"
        },
        {
          "title": "在带命名空间的模块内访问全局内容（Global Assets）",
          "url": "/guide/modules.html#命名空间-在带命名空间的模块内访问全局内容（global-assets）",
          "content": "在带命名空间的模块内访问全局内容（Global Assets）如果你希望使用全局 state ，rootState ，通过 context 对象的属性传入 action。若需要在全局命名空间内分发 action 或提交 mutation，将 { root: true } 作为第三参数传给 dispatch 即可。modules: {  foo: {\n    namespaced: true,\n\n    actions: {\n      // 在这个模块中， dispatch 和 commit 也被局部化了\n      // 他们可以接受 `root` 属性以访问根 dispatch 或 commit\n      someAction ({ dispatch, commit }) {\n        commit('someOtherAction') // -> 'foo/someOtherAction'\n        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'\n\n        commit('someMutation') // -> 'foo/someMutation'\n        commit('someMutation', null, { root: true }) // -> 'someMutation'\n      },\n      someOtherAction (ctx, payload) { ... }\n    }\n  }\n}\n\n"
        },
        {
          "title": "在带命名空间的模块注册全局 action",
          "url": "/guide/modules.html#命名空间-在带命名空间的模块注册全局-action",
          "content": "在带命名空间的模块注册全局 action若需要在带命名空间的模块注册全局 action，你可添加 root: true，并将这个 action 的定义放在函数 handler 中。例如：{  actions: {\n    someOtherAction ({dispatch}) {\n      dispatch('someAction')\n    }\n  },\n  modules: {\n    foo: {\n      namespaced: true,\n\n      actions: {\n        someAction: {\n          root: true,\n          handler (namespacedContext, payload) { ... } // -> 'someAction'\n        }\n      }\n    }\n  }\n}\n\n"
        },
        {
          "title": "给插件开发者的注意事项",
          "url": "/guide/modules.html#命名空间-给插件开发者的注意事项",
          "content": "给插件开发者的注意事项如果你开发的插件（Plugin）提供了模块并允许用户将其添加到 redux-sam ，可能需要考虑模块的空间名称问题。对于这种情况，你可以通过插件的参数对象来允许用户指定空间名称：// 通过插件的参数对象得到空间名称// 然后返回 Vuex 插件函数\nexport function createPlugin (options = {}) {\n  return function (sam) {\n    // 把空间名字添加到插件模块的类型（type）中去\n    const namespace = options.namespace || ''\n    sam.dispatch(namespace + 'pluginAction')\n  }\n}\n\n"
        },
        {
          "title": "模块动态注册",
          "url": "/guide/modules.html#模块动态注册",
          "content": "模块动态注册在 store 创建之后，你可以使用 sam.registerModule 方法注册模块：// 注册模块 `myModule`sam.registerModule('myModule', {\n  // ...\n})\n// 注册嵌套模块 `nested/myModule`\nsam.registerModule(['nested', 'myModule'], {\n  // ...\n})\n\n之后就可以通过 sam.state.myModule 和 sam.state.nested.myModule 访问模块的状态。你也可以使用 sam.unregisterModule(moduleName) 来动态卸载模块。注意，你不能使用此方法卸载静态模块（即创建 sam 时声明的模块）。"
        },
        {
          "title": "保留 state",
          "url": "/guide/modules.html#模块动态注册-保留-state",
          "content": "保留 state在注册一个新 module 时，你很有可能想保留过去的 state，例如从一个服务端渲染的应用保留 state。你可以通过 preserveState 选项将其归档：store.registerModule('a', module, { preserveState: true })。当你设置 preserveState: true 时，该模块会被注册，action、mutation 会被添加到 store 中，但是 state 不会。这里假设 store 的 state 已经包含了这个 module 的 state 并且你不希望将其覆写。"
        },
        {
          "title": "模块重用",
          "url": "/guide/modules.html#模块重用",
          "content": "模块重用有时我们可能需要创建一个模块的多个实例，例如：创建多个 store，他们公用同一个模块 (例如当 runInNewContext 选项是 false 或 'once' 时，为了在服务端渲染中避免有状态的单例)\n在一个 store 中多次注册同一个模块\n如果我们使用一个纯对象来声明模块的状态，那么这个状态对象会通过引用被共享，导致状态对象被修改时 store 或模块间数据互相污染的问题。const MyReusableModule = {  state () {\n    return {\n      foo: 'bar'\n    }\n  },\n  // mutation, action 等等...\n}\n\n"
        }
      ]
    },
    {
      "title": "项目结构",
      "content": "redux-sam 并不限制你的代码结构。但是，它规定了一些需要遵守的规则：应用层级的状态应该集中到单个 store 对象中。提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。异步逻辑都应该封装到 action 里面。只要你遵守以上规则，如何组织代码随你便。如果你的 store 文件太大，只需将 action、mutation 分割到单独的文件。对于大型应用，我们会希望把 redux-sam 相关代码分割到模块中。下面是项目结构示例：├── index.html├── main.js\n├── api\n│   └── ... # 抽取出API请求\n├── components\n│   ├── App.vue\n│   └── ...\n└── store\n    ├── index.js          # 我们组装模块并导出 store 的地方\n    ├── actions.js        # 根级别的 action\n    ├── mutations.js      # 根级别的 mutation\n    └── modules\n        ├── cart.js       # 购物车模块\n        └── products.js   # 产品模块\n\n",
      "url": "/guide/structure.html",
      "children": []
    },
    {
      "title": "插件",
      "content": "redux-sam 接受 plugins 选项，这个选项暴露出每次 mutation redux-sam 插件就是一个函数，它接收 redux-sam 实例 作为唯一参数：const myPlugin = sam => {  // 当 redux-sam 初始化后调用\n  sam.subscribe((mutation, state) => {\n    // 每次 mutation 之后调用\n    // mutation 的格式为 { type, payload }\n  })\n}\n\n然后像这样使用：const sam = new Sam({  // ...\n  plugins: [myPlugin]\n})\n\n",
      "url": "/guide/plugins.html",
      "children": [
        {
          "title": "在插件内提交 Mutation",
          "url": "/guide/plugins.html#在插件内提交-mutation",
          "content": "在插件内提交 Mutation在插件中不允许直接修改状态——类似于组件，只能通过提交 mutation 来触发变化。通过提交 mutation，插件可以用来同步数据源到 redux-sam。例如，同步 websocket 数据源到 redux-sam（下面是个大概例子，实际上 createPlugin 方法可以有更多选项来完成复杂任务）：export default function createWebSocketPlugin (socket) {  return sam => {\n    socket.on('data', data => {\n      sam.dispatch('receiveData', data)\n    })\n    sam.subscribe(mutation => {\n      if (mutation.type === 'UPDATE_DATA') {\n        socket.emit('update', mutation.payload)\n      }\n    })\n  }\n}\n\nconst plugin = createWebSocketPlugin(socket)\nconst sam = new Sam({\n  state,\n  mutations,\n  plugins: [plugin]\n})\n\n"
        },
        {
          "title": "生成 State 快照",
          "url": "/guide/plugins.html#生成-state-快照",
          "content": "生成 State 快照const myPluginWithSnapshot = sam => {  let prevState = _.cloneDeep(sam.state)\n  sam.subscribe((mutation, state) => {\n    let nextState = _.cloneDeep(state)\n\n    // 比较 prevState 和 nextState...\n\n    // 保存状态，用于下一次 mutation\n    prevState = nextState\n  })\n}\n\n生成状态快照的插件应该只在开发阶段使用，使用 webpack 或 Browserify，让构建工具帮我们处理：const sam = new Sam({  // ...\n  plugins: process.env.NODE_ENV !== 'production'\n    ? [myPluginWithSnapshot]\n    : []\n})\n\n上面插件会默认启用。在发布阶段，你需要使用 webpack 的 DefinePlugin 或者是 Browserify 的 envify 使 process.env.NODE_ENV !== 'production' 为 false。"
        },
        {
          "title": "内置 Logger 插件",
          "url": "/guide/plugins.html#内置-logger-插件",
          "content": "内置 Logger 插件import createSamLogger from 'redux-sam/logger'\nconst sam = new Sam({\n  plugins: [createSamLogger()]\n})\n\ncreateSamLogger 函数有几个配置项：const logger = createSamLogger({  collapsed: false, // 自动展开记录的 mutation\n  filter (mutation, stateBefore, stateAfter) {\n    // 若 mutation 需要被记录，就让它返回 true 即可\n    // 顺便，`mutation` 是个 { type, payload } 对象\n    return mutation.type !== \"aBlacklistedMutation\"\n  },\n  transformer (state) {\n    // 在开始记录之前转换状态\n    // 例如，只返回指定的子树\n    return state.subTree\n  },\n  mutationTransformer (mutation) {\n    // mutation 按照 { type, payload } 格式记录\n    // 我们可以按任意方式格式化\n    return mutation.type\n  },\n  logger: console, // 自定义 console 实现，默认为 `console`\n})\n\n日志插件还可以直接通过  标签引入，它会提供全局方法 createReduxSamLogger。要注意，logger 插件会生成状态快照，所以仅在开发环境使用。"
        }
      ]
    },
    {
      "title": "热重载",
      "content": "使用 webpack 的 Hot Module Replacement API，redux-sam 支持在开发过程中热重载 mutation、module和action。你也可以在 Browserify 中使用 browserify-hmr 插件。对于 mutation 和模块，你需要使用 store.hotUpdate() 方法：// store.jsimport { createStore, applyMiddleware } from 'redux';\nimport { Sam, reducer, middleware } from 'redux-sam';\nimport mutations from './mutations'\nimport moduleA from './modules/a'\n\nconst state = { ... }\n\nconst sam = new Sam({\n  state,\n  mutations,\n  modules: {\n    a: moduleA\n  }\n})\nconst store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));\n\nif (module.hot) {\n  // 使 action 和 mutation 成为可热重载模块\n  module.hot.accept(['./mutations', './modules/a'], () => {\n    // 获取更新后的模块\n    // 因为 babel 6 的模块编译格式问题，这里需要加上 `.default`\n    const newMutations = require('./mutations').default\n    const newModuleA = require('./modules/a').default\n    // 加载新模块\n    sam.hotUpdate({\n      mutations: newMutations,\n      modules: {\n        a: newModuleA\n      }\n    })\n  })\n}\n\n参考热重载示例 counter-hot。",
      "url": "/guide/hot-reload.html",
      "children": []
    }
  ],
  "API参考": [
    {
      "title": "API 参考",
      "content": "",
      "url": "/api/index.html",
      "children": [
        {
          "title": "reducer",
          "url": "/api/index.html#reducer",
          "content": "reducer调用 createStore 时传入的第一个参数，该函数主要用于调度指定的 mutation。"
        },
        {
          "title": "middleware",
          "url": "/api/index.html#middleware",
          "content": "middleware调用 createStore 时传入的第三个参数，该函数主要用于调度指定的 action。"
        },
        {
          "title": "Sam",
          "url": "/api/index.html#sam",
          "content": "Samimport { createStore, applyMiddleware } from 'redux';import { Sam, reducer, middleware } from 'redux-sam';\n\nconst sam = new Sam({ ... });\n\nconst store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));\n\n"
        },
        {
          "title": "Sam 构造器选项",
          "url": "/api/index.html#sam-构造器选项",
          "content": "Sam 构造器选项"
        },
        {
          "title": "state",
          "url": "/api/index.html#sam-构造器选项-state",
          "content": "state\n类型: Object | Function\nSam 实例的根 state 对象。详细介绍\n如果你传入返回一个对象的函数，其返回的对象会被用作根 state。这在你想要重用 state 对象，尤其是对于重用 module 来说非常有用。详细介绍\n\n"
        },
        {
          "title": "mutations",
          "url": "/api/index.html#sam-构造器选项-mutations",
          "content": "mutations\n类型: { [type: string]: Function }\n在 sam 上注册 mutation，处理函数总是接受 state 作为第一个参数（如果定义在模块中，则为模块的局部状态），payload 作为第二个参数（可选）。\n详细介绍\n\n"
        },
        {
          "title": "actions",
          "url": "/api/index.html#sam-构造器选项-actions",
          "content": "actions\n类型: { [type: string]: Function }\n在 sam 上注册 action。处理函数总是接受 context 作为第一个参数，payload 作为第二个参数（可选）。\ncontext 对象包含以下属性：\n{\n  state,      // 等同于 `sam.state`，若在模块中则为局部状态\n  rootState,  // 等同于 `sam.state`，只存在于模块中\n  commit,     // 等同于 `sam.commit`\n  dispatch,   // 等同于 `sam.dispatch`\n}\n\n\n同时如果有第二个参数 payload 的话也能够接收。\n详细介绍\n\n"
        },
        {
          "title": "modules",
          "url": "/api/index.html#sam-构造器选项-modules",
          "content": "modules\n类型: Object\n包含了子模块的对象，会被合并到 sam，大概长这样：\n{\n  key: {\n    state,\n    namespaced?,\n    mutations,\n    actions?,\n    modules?\n  },\n  ...\n}\n\n\n与根模块的选项一样，每个模块也包含 state 和 mutations 选项。模块的状态使用 key 关联到 sam 的根状态。模块的 mutation 只会接收 module 的局部状态作为第一个参数，而不是根状态，并且模块 action 的 context.state 同样指向局部状态。\n详细介绍\n\n"
        },
        {
          "title": "plugins",
          "url": "/api/index.html#sam-构造器选项-plugins",
          "content": "plugins\n类型: Array\n一个数组，包含应用在 sam 上的插件方法。这些插件直接接收 sam 作为唯一参数，可以监听 mutation（用于外部地数据持久化、记录或调试）或者提交 mutation （用于内部数据，例如 websocket 或 某些观察者）\n详细介绍\n\n"
        },
        {
          "title": "Sam 实例属性",
          "url": "/api/index.html#sam-实例属性",
          "content": "Sam 实例属性"
        },
        {
          "title": "state",
          "url": "/api/index.html#sam-实例属性-state",
          "content": "state\n类型: Object\n根状态，只读。\n\n"
        },
        {
          "title": "Sam 实例方法",
          "url": "/api/index.html#sam-实例方法",
          "content": "Sam 实例方法"
        },
        {
          "title": "commit",
          "url": "/api/index.html#sam-实例方法-commit",
          "content": "commit\ncommit(type: string, payload?: any, options?: Object)\n\n\ncommit(mutation: Object, options?: Object)\n提交 mutation。options 里可以有 root: true，它允许在命名空间模块里提交根的 mutation。\n详细介绍\n\n"
        },
        {
          "title": "dispatch",
          "url": "/api/index.html#sam-实例方法-dispatch",
          "content": "dispatch\ndispatch(type: string, payload?: any, options?: Object)\n\n\ndispatch(action: Object, options?: Object)\n分发 action。options 里可以有 root: true，它允许在命名空间模块里分发根的 action。返回一个解析所有被触发的 action 处理器的 Promise。\n详细介绍\n\n"
        },
        {
          "title": "replaceState",
          "url": "/api/index.html#sam-实例方法-replacestate",
          "content": "replaceStatereplaceState(state: Object)\n替换 sam 的根状态，仅用状态合并或时光旅行调试。"
        },
        {
          "title": "subscribe",
          "url": "/api/index.html#sam-实例方法-subscribe",
          "content": "subscribe\nsubscribe(handler: Function): Function\n订阅 sam 的 mutation。handler 会在每个 mutation 完成后调用，接收 mutation 和经过 mutation 后的状态作为参数：\nsam.subscribe((mutation, state) => {\n  console.log(mutation.type)\n  console.log(mutation.payload)\n})\n\n\n要停止订阅，调用此方法返回的函数即可停止订阅。\n通常用于插件。详细介绍\n\n"
        },
        {
          "title": "subscribeAction",
          "url": "/api/index.html#sam-实例方法-subscribeaction",
          "content": "subscribeAction\nsubscribeAction(handler: Function): Function\n订阅 sam 的 action。handler 会在每个 action 分发的时候调用并接收 action 描述和当前的 sam 的 state 这两个参数：\nsam.subscribeAction((action, state) => {\n  console.log(action.type)\n  console.log(action.payload)\n})\n\n\nsubscribeAction 也可以指定订阅处理函数的被调用时机应该在一个 action 分发之前还是之后 (默认行为是之前)：\nsam.subscribeAction({\n  before: (action, state) => {\n    console.log(`before action ${action.type}`)\n  },\n  after: (action, state) => {\n    console.log(`after action ${action.type}`)\n  }\n})\n\n\n该功能常用于插件。详细介绍\n\n"
        },
        {
          "title": "registerModule",
          "url": "/api/index.html#sam-实例方法-registermodule",
          "content": "registerModule\nregisterModule(path: string | Array, module: Module, options?: Object)\n注册一个动态模块。详细介绍\noptions 可以包含 preserveState: true 以允许保留之前的 state。用于服务端渲染。\n\n"
        },
        {
          "title": "unregisterModule",
          "url": "/api/index.html#sam-实例方法-unregistermodule",
          "content": "unregisterModule\nunregisterModule(path: string | Array)\n卸载一个动态模块。详细介绍\n\n"
        },
        {
          "title": "hotUpdate",
          "url": "/api/index.html#sam-实例方法-hotupdate",
          "content": "hotUpdate\nhotUpdate(newOptions: Object)\n热替换新的 action 和 mutation。详细介绍\n\n"
        }
      ]
    }
  ]
}