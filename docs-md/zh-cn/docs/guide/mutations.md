# Mutation

更改 redux-sam 的 state 的唯一方法是提交 mutation。redux-sam 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

```js
import { createStore } from 'redux-sam';
import { Component } from 'react';
import createLogger from 'redux-sam/logger';

const { store, sam } = createStore({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  },
  plugins: [process.env.NODE_ENV !== 'production' && createLogger()]
}, Component.prototype);

export { store, sam };

```

你不能直接调用一个 mutation handler。这个选项更像是事件注册：“当触发一个类型为 increment 的 mutation 时，调用此函数。”要唤醒一个 mutation handler，你需要以相应的 type 调用 store.dispatch 方法：

```js
sam.commit('increment')

```

或者

```js
store.dispatch('increment')

```

## 提交载荷（Payload）

你可以向 store.dispatch 传入额外的参数，即 mutation 的 载荷（payload）：

```js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}

```

```js
sam.commit('increment', 10)

```

或者

```js
store.dispatch('increment', 10)

```

在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读：

```js
// ...
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}

```

```js
sam.commit('increment', {
  amount: 10
})

```

或者

```js
store.dispatch('increment', {
  amount: 10
})

```

## 对象风格的提交方式

提交 mutation 的另一种方式是直接使用包含 type 属性的对象：

```js
sam.commit({
  type: 'increment',
  payload: {
    amount: 10
  }
})

```

或者

```js
store.dispatch({
  type: 'increment',
  payload: {
    amount: 10
  }
})

```

当使用对象风格的提交方式，整个对象都作为载荷传给 mutation 函数，因此 handler 保持不变：

```js
mutations: {
  increment (state, payload) {
    state.count += payload.amount
  }
}

```

## 使用常量替代 Mutation 事件类型

使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：

```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'

```

```js
// store.js
import { Sam, reducer, middleware } from 'redux-sam';
import { SOME_MUTATION } from './mutation-types'

const sam = new Sam({
  state: { ... },
  mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})

```

用不用常量取决于你——在需要多人协作的大型项目中，这会很有帮助。但如果你不喜欢，你完全可以不这样做。

## Mutation 必须是同步函数

一条重要的原则就是要记住 mutation 必须是同步函数。为什么？请参考下面的例子：

```js
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}

```

## 下一步：Action
在 mutation 中混合异步调用会导致你的程序很难调试。例如，当你调用了两个包含异步回调的 mutation 来改变状态，你怎么知道什么时候回调和哪个先回调呢？这就是为什么我们要区分这两个概念。在 redux-sam 中，mutation 都是同步事务：

```js
store.dispatch('increment') // or sam.commit('increment')
// 任何由 "increment" 导致的状态变更都应该在此刻完成。

```

为了处理异步操作，让我们来看一看 [Action](#actions)。
