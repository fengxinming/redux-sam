# API 参考

## reducer

调用 `Redux.createStore` 时传入的第一个参数，该函数主要用于调度指定的 `mutation`。

## middleware

调用 `Redux.createStore` 时传入的第三个参数，该函数主要用于调度指定的 `action`。

## createHelpers

返回两个辅助函数 mapMutations 和 mapActions。

```js
const { mapActions, mapMutations } = createHelpers(sam);

```

### mapActions

映射 actions 到 React 组件上作为实例方法

### mapMutations

映射 mutations 到 React 组件上作为实例方法

## install

安装 store、sam、mapMutations 和 mapActions 到 React 组件实例上

```js
install(Component, { store, sam, mapActions, mapMutations });

```

## Sam

```js
import { createStore, applyMiddleware } from 'redux';
import { Sam, reducer, middleware } from 'redux-sam';

const sam = new Sam({ ... });

const store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));

export { store, sam };

```

## createStore

```js
import { createStore } from 'redux-sam';
import { Component } from 'react';

const { store, sam } = createStore({ ... }, Component);

export { store, sam };

```

```js
import React, { Component } from 'react';

class Counter extends Component {
  constructor(props) {
    super(props);

    // this.$store redux实例
    // this.$sam sam实例
    // this.$mapActions(); action辅助函数
    // this.$mapMutations(); mutation辅助函数
  }

  render() {
    // ...
  }
}

```

## Sam 构造器选项

### state

- 类型: Object | Function

  Sam 实例的根 state 对象。[详细介绍](../guide/state.html)

  如果你传入返回一个对象的函数，其返回的对象会被用作根 state。这在你想要重用 state 对象，尤其是对于重用 module 来说非常有用。[详细介绍](../guide/modules.html#模块重用)

### mutations

- 类型: { [type: string]: Function }

  在 sam 上注册 mutation，处理函数总是接受 `state` 作为第一个参数（如果定义在模块中，则为模块的局部状态），`payload` 作为第二个参数（可选）。

  [详细介绍](../guide/mutations.html)

### actions
- 类型: { [type: string]: Function }

  在 sam 上注册 action。处理函数总是接受 `context` 作为第一个参数，`payload` 作为第二个参数（可选）。

  `context` 对象包含以下属性：

  ```js
  {
    state,      // 等同于 `sam.state`，若在模块中则为局部状态
    rootState,  // 等同于 `sam.state`，只存在于模块中
    commit,     // 等同于 `sam.commit`
    dispatch,   // 等同于 `sam.dispatch`
  }

  ```

  同时如果有第二个参数 `payload` 的话也能够接收。

  [详细介绍](../guide/actions.html)

### modules

- 类型: Object

  包含了子模块的对象，会被合并到 sam，大概长这样：

  ```js
  {
    key: {
      state,
      namespaced?,
      mutations,
      actions?,
      modules?
    },
    ...
  }

  ```

  与根模块的选项一样，每个模块也包含 `state` 和 `mutations` 选项。模块的状态使用 key 关联到 sam 的根状态。模块的 mutation 只会接收 module 的局部状态作为第一个参数，而不是根状态，并且模块 action 的 `context.state` 同样指向局部状态。

  [详细介绍](../guide/modules.html)

### plugins

- 类型: Array<Function>

  一个数组，包含应用在 sam 上的插件方法。这些插件直接接收 sam 作为唯一参数，可以监听 mutation（用于外部地数据持久化、记录或调试）或者提交 mutation （用于内部数据，例如 websocket 或 某些观察者）

  [详细介绍](../guide/plugins.html)

## Sam 实例属性

### state

- 类型: Object

  根状态，只读。

## Sam 实例方法

### commit

- `commit(type: string, payload?: any, options?: Object)`

- `commit(mutation: Object, options?: Object)`

  提交 mutation。options 里可以有 root: true，它允许在[命名空间模块](../guide/modules.html#命名空间)里提交根的 mutation。

  [详细介绍](../guide/mutations.html)

### dispatch

- `dispatch(type: string, payload?: any, options?: Object)`

- `dispatch(action: Object, options?: Object)`

  分发 action。options 里可以有 root: true，它允许在[命名空间模块](../guide/modules.html#命名空间)里分发根的 action。返回一个解析所有被触发的 action 处理器的 Promise。

  [详细介绍](../guide/actions.html)

### replaceState

- `replaceState(state: Object)`

替换 sam 的根状态，仅用状态合并或时光旅行调试。

### subscribe

- `subscribe(handler: Function): Function`

  订阅 sam 的 mutation。handler 会在每个 mutation 完成后调用，接收 mutation 和经过 mutation 后的状态作为参数：

  ```js
  sam.subscribe((mutation, state) => {
    console.log(mutation.type)
    console.log(mutation.payload)
  })

  ```

  要停止订阅，调用此方法返回的函数即可停止订阅。

  通常用于插件。[详细介绍](../guide/plugins.html)

### subscribeAction

- `subscribeAction(handler: Function): Function`

  订阅 sam 的 action。handler 会在每个 action 分发的时候调用并接收 action 描述和当前的 sam 的 state 这两个参数：

  ```js
  sam.subscribeAction((action, state) => {
    console.log(action.type)
    console.log(action.payload)
  })

  ```

  subscribeAction 也可以指定订阅处理函数的被调用时机应该在一个 action 分发之前还是之后 (默认行为是之前)：

  ```js
  sam.subscribeAction({
    before: (action, state) => {
      console.log(`before action ${action.type}`)
    },
    after: (action, state) => {
      console.log(`after action ${action.type}`)
    }
  })

  ```

  该功能常用于插件。[详细介绍](../guide/plugins.html)

### registerModule

- `registerModule(path: string | Array<string>, module: Module, options?: Object)`

  注册一个动态模块。[详细介绍](../guide/modules.html#模块动态注册)

  options 可以包含 preserveState: true 以允许保留之前的 state。用于服务端渲染。

### unregisterModule

- `unregisterModule(path: string | Array<string>)`

  卸载一个动态模块。[详细介绍](../guide/modules.html#模块动态注册)

### hotUpdate

- `hotUpdate(newOptions: Object)`

  热替换新的 action 和 mutation。[详细介绍](../guide/hot-reload.html)

## 组件绑定的辅助函数

### mapActions

- `mapActions(comp: Object<Component>, map: Array<string> | Object<string | function>, namespace?: string): Object`

- `this.$mapActions(map: Array<string> | Object<string | function>, namespace?: string): Object`

创建组件方法分发 action。[详细介绍](../guide/actions.html#在组件中分发-Action)

最后一个参数是可选的，可以是一个命名空间字符串。[详细介绍](../guide/modules.html#命名空间-带命名空间的绑定函数)

对象形式的第二个参数的成员可以是一个函数。`function(dispatch: function, ...args: any[])`

### mapMutations

- `mapMutations(comp: Object<Component>, map: Array<string> | Object<string | function>, namespace?: string): Object`

- `this.$mapMutations(map: Array<string> | Object<string | function>, namespace?: string): Object`

创建组件方法提交 mutation。[详细介绍](../guide/mutations.html#在组件中提交-mutation)

最后一个参数是可选的，可以是一个命名空间字符串。[详细介绍](../guide/modules.html#命名空间-带命名空间的绑定函数)

对象形式的第二个参数的成员可以是一个函数。`function(commit: function, ...args: any[])`
