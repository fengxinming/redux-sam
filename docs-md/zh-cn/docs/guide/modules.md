# Module

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，redux-sam 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation和action、甚至是嵌套子模块——从上至下进行同样方式的分割：

```js
import { Sam, reducer, middleware } from 'redux-sam';

const moduleA = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const moduleB = {
  state: { ... },
  mutations: { ... },
  actions: { ... }
}

const sam = new Sam({
  modules: {
    a: moduleA,
    b: moduleB
  }
})

sam.state.a // -> moduleA 的状态
sam.state.b // -> moduleB 的状态

```

## 模块的局部状态

对于模块内部的 mutation ，接收的第一个参数是模块的局部状态对象。

```js
const moduleA = {
  state: { count: 0 },
  mutations: {
    increment (state) {
      // 这里的 `state` 对象是模块的局部状态
      state.count++
    }
  }
}

```

同样，对于模块内部的 action，局部状态通过 context.state 暴露出来，根节点状态则为 context.rootState：

```js
const moduleA = {
  // ...
  actions: {
    incrementIfOddOnRootSum ({ state, commit, rootState }) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}

```

## 命名空间

默认情况下，模块内部的 action和mutation 是注册在全局命名空间的——这样使得多个模块能够对同一 mutation 或 action 作出响应。

如果希望你的模块具有更高的封装度和复用性，你可以通过添加 namespaced: true 的方式使其成为带命名空间的模块。当模块被注册后，它的所有 getter、action 及 mutation 都会自动根据模块注册的路径调整命名。例如：

```js
import { Sam, reducer, middleware } from 'redux-sam';

const sam = new Sam({
  modules: {
    account: {
      namespaced: true,

      // 模块内容（module assets）
      state: { ... }, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性
      actions: {
        login () { ... } // -> dispatch('account/login', null, { async: true })
      },
      mutations: {
        login () { ... } // -> dispatch('account/login')
      },

      // 嵌套模块
      modules: {
        // 继承父模块的命名空间
        myPage: {
          state: { ... }
        },

        // 进一步嵌套命名空间
        posts: {
          namespaced: true,

          state: { ... }
        }
      }
    }
  }
})

```

启用了命名空间的 action 会收到局部化的 dispatch 。换言之，你在使用模块内容（module assets）时不需要在同一模块内额外添加空间名前缀。更改 namespaced 属性后不需要修改模块内的代码。

### 在带命名空间的模块内访问全局内容（Global Assets）

如果你希望使用全局 state ，rootState ，通过 context 对象的属性传入 action。

若需要在全局命名空间内分发 action 或提交 mutation，将 { root: true } 作为第三参数传给 dispatch 即可。

```js
modules: {
  foo: {
    namespaced: true,

    actions: {
      // 在这个模块中， dispatch 和 commit 也被局部化了
      // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
      someAction ({ dispatch, commit }) {
        commit('someOtherAction') // -> 'foo/someOtherAction'
        dispatch('someOtherAction', null, { root: true }) // -> 'someOtherAction'

        commit('someMutation') // -> 'foo/someMutation'
        commit('someMutation', null, { root: true }) // -> 'someMutation'
      },
      someOtherAction (ctx, payload) { ... }
    }
  }
}

```

### 在带命名空间的模块注册全局 action

若需要在带命名空间的模块注册全局 action，你可添加 root: true，并将这个 action 的定义放在函数 handler 中。例如：

```js
{
  actions: {
    someOtherAction ({dispatch}) {
      dispatch('someAction')
    }
  },
  modules: {
    foo: {
      namespaced: true,

      actions: {
        someAction: {
          root: true,
          handler (namespacedContext, payload) { ... } // -> 'someAction'
        }
      }
    }
  }
}

```

### 带命名空间的绑定函数

当使用 `mapActions` 和 `mapMutations` 这些函数来绑定带命名空间的模块时，写起来可能比较繁琐：

```js
import React, { Component } from 'react';
import { mapActions } from './store';

class Counter extends Component {
  constructor(props) {
    super(props);

    mapActions(this, [
      'some/nested/module/foo', // -> this['some/nested/module/foo']()
      'some/nested/module/bar' // -> this['some/nested/module/bar']()
    ]);

    // Or
    this.$mapActions([
      'some/nested/module/foo', // -> this['some/nested/module/foo']()
      'some/nested/module/bar' // -> this['some/nested/module/bar']()
    ]);
  }

  render() {
    // ...
  }
}

```

对于这种情况，你可以将模块的空间名称字符串作为最后一个参数传递给上述函数，这样所有绑定都会自动将该模块作为上下文。于是上面的例子可以简化为：

```js
import React, { Component } from 'react';
import { mapActions } from './store';

class Counter extends Component {
  constructor(props) {
    super(props);

    mapActions(this, [
      'foo', // -> this.foo()
      'bar' // -> this.bar()
    ], 'some/nested/module');

    // Or
    this.$mapActions([
      'foo', // -> this.foo()
      'bar' // -> this.bar()
    ], 'some/nested/module');
  }

  render() {
    // ...
  }
}

```

### 给插件开发者的注意事项

如果你开发的[插件（Plugin）](#plugins)提供了模块并允许用户将其添加到 redux-sam ，可能需要考虑模块的空间名称问题。对于这种情况，你可以通过插件的参数对象来允许用户指定空间名称：

```js
// 通过插件的参数对象得到空间名称
// 然后返回 Vuex 插件函数
export function createPlugin (options = {}) {
  return function (sam) {
    // 把空间名字添加到插件模块的类型（type）中去
    const namespace = options.namespace || ''
    sam.dispatch(namespace + 'pluginAction')
  }
}

```

## 模块动态注册

在 store 创建之后，你可以使用 sam.registerModule 方法注册模块：

```js
// 注册模块 `myModule`
sam.registerModule('myModule', {
  // ...
})
// 注册嵌套模块 `nested/myModule`
sam.registerModule(['nested', 'myModule'], {
  // ...
})

```

之后就可以通过 sam.state.myModule 和 sam.state.nested.myModule 访问模块的状态。

你也可以使用 sam.unregisterModule(moduleName) 来动态卸载模块。注意，你不能使用此方法卸载静态模块（即创建 sam 时声明的模块）。

### 保留 state

在注册一个新 module 时，你很有可能想保留过去的 state，例如从一个服务端渲染的应用保留 state。你可以通过 preserveState 选项将其归档：store.registerModule('a', module, { preserveState: true })。

当你设置 preserveState: true 时，该模块会被注册，action、mutation 会被添加到 store 中，但是 state 不会。这里假设 store 的 state 已经包含了这个 module 的 state 并且你不希望将其覆写。

## 模块重用

有时我们可能需要创建一个模块的多个实例，例如：

- 创建多个 store，他们公用同一个模块 (例如当 runInNewContext 选项是 false 或 'once' 时，为了在服务端渲染中避免有状态的单例)
- 在一个 store 中多次注册同一个模块

如果我们使用一个纯对象来声明模块的状态，那么这个状态对象会通过引用被共享，导致状态对象被修改时 store 或模块间数据互相污染的问题。

```js
const MyReusableModule = {
  state () {
    return {
      foo: 'bar'
    }
  },
  // mutation, action 等等...
}

```
