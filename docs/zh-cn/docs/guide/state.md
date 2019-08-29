# State

## 单一状态树

redux-sam 使用单一状态树——是的，用一个对象就包含了全部的应用层级状态。至此它便作为一个“唯一数据源 ([SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth))”而存在。这也意味着，每个应用将仅仅包含一个 store 实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。

单状态树和模块化并不冲突——在后面的章节里我们会讨论如何将状态和状态变更事件分布到各个子模块中。

## 在 React 组件中获得 redux 状态
那么我们如何在 React 组件中展示状态呢？通过connect方法把state中的值作为属性传入组件：

```js
// 创建一个 Counter 组件
class Counter extends Component {
  render() {
    return (
      <div>{this.props.count}</div>
    );
  }
}
export default connect(state => { count: state.count })(Counter);

```

每当 getState().count 变化的时候, 都会重新求取计算属性，并且触发更新相关联的 DOM。
