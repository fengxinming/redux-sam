# 插件

redux-sam 接受 plugins 选项，这个选项暴露出每次 mutation redux-sam 插件就是一个函数，它接收 redux-sam 实例 作为唯一参数：

```js
const myPlugin = sam => {
  // 当 redux-sam 初始化后调用
  sam.subscribe((mutation, state) => {
    // 每次 mutation 之后调用
    // mutation 的格式为 { type, payload }
  })
}

```

然后像这样使用：

```js
const sam = new Sam({
  // ...
  plugins: [myPlugin]
})

```

## 在插件内提交 Mutation

在插件中不允许直接修改状态——类似于组件，只能通过提交 mutation 来触发变化。

通过提交 mutation，插件可以用来同步数据源到 redux-sam。例如，同步 websocket 数据源到 redux-sam（下面是个大概例子，实际上 createPlugin 方法可以有更多选项来完成复杂任务）：

```js
export default function createWebSocketPlugin (socket) {
  return sam => {
    socket.on('data', data => {
      sam.dispatch('receiveData', data)
    })
    sam.subscribe(mutation => {
      if (mutation.type === 'UPDATE_DATA') {
        socket.emit('update', mutation.payload)
      }
    })
  }
}

```

```js
const plugin = createWebSocketPlugin(socket)

const sam = new Sam({
  state,
  mutations,
  plugins: [plugin]
})

```

## 生成 State 快照

```js
const myPluginWithSnapshot = sam => {
  let prevState = _.cloneDeep(sam.state)
  sam.subscribe((mutation, state) => {
    let nextState = _.cloneDeep(state)

    // 比较 prevState 和 nextState...

    // 保存状态，用于下一次 mutation
    prevState = nextState
  })
}

```

生成状态快照的插件应该只在开发阶段使用，使用 webpack 或 Browserify，让构建工具帮我们处理：

```js
const sam = new Sam({
  // ...
  plugins: process.env.NODE_ENV !== 'production'
    ? [myPluginWithSnapshot]
    : []
})

```

上面插件会默认启用。在发布阶段，你需要使用 webpack 的 DefinePlugin 或者是 Browserify 的 envify 使 process.env.NODE_ENV !== 'production' 为 false。

## 内置 Logger 插件

```js
import createSamLogger from 'redux-sam/logger'

const sam = new Sam({
  plugins: [createSamLogger()]
})

```

createSamLogger 函数有几个配置项：

```js
const logger = createSamLogger({
  collapsed: false, // 自动展开记录的 mutation
  filter (mutation, stateBefore, stateAfter) {
    // 若 mutation 需要被记录，就让它返回 true 即可
    // 顺便，`mutation` 是个 { type, payload } 对象
    return mutation.type !== "aBlacklistedMutation"
  },
  transformer (state) {
    // 在开始记录之前转换状态
    // 例如，只返回指定的子树
    return state.subTree
  },
  mutationTransformer (mutation) {
    // mutation 按照 { type, payload } 格式记录
    // 我们可以按任意方式格式化
    return mutation.type
  },
  logger: console, // 自定义 console 实现，默认为 `console`
})

```

日志插件还可以直接通过 `<script>` 标签引入，它会提供全局方法 createReduxSamLogger。

要注意，logger 插件会生成状态快照，所以仅在开发环境使用。
