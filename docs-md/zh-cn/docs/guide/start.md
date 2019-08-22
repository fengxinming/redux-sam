# 入门篇

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
  <img src='https://camo.githubusercontent.com/29765c4a32f03bd01d44edef1cd674225e3c906b/68747470733a2f2f63646e2e7261776769742e636f6d2f66616365626f6f6b2f6372656174652d72656163742d6170702f323762343261632f73637265656e636173742e737667' width='600' alt='npm start'>
</p>

## 调整代码结构

```js
├── public
│   ├── index.html
│   └── ... # 静态资源
└── src
    ├── index.js
    ├── api
    │    └── ... # 抽取出API请求
    ├── components
    │    ├── App
    │    └── ... # 抽取出公共组件
    └── store
         ├── index.js          # 我们组装模块并导出 store 的地方
         ├── actions.js        # 根级别的 action
         └── mutations.js      # 根级别的 mutation

```

## 配置 mutations

配置 `src/store/mutations.js`

```js
export default {
  increment(state) {
    state.count++;
  }
}

```

## 配置 actions

配置 `src/store/actions.js`

```js
export default {
  increment({ commit }) {
    setTimeout(() => {
      commit('increment');
    }, 1000);
  }
};

```

## 初始化 store

配置 `src/store/index.js`

```js
import { createStore } from 'redux-sam';
import { Component } from 'react';
import mutations from './mutations';
import actions from './actions';

const { store } = createStore({
  state: {
    count: 0
  },
  mutations,
  actions
}, Component);

export { store };

```

## 修改默认的 App 组件

```js
import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './index.css';

class App extends Component {
  onCommit = () => {
    this.$sam.commit('increment');
  }
  onDispatch = () => {
    this.$sam.dispatch('increment');
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div>
            <button className="button" onClick={this.onCommit}>commit</button>&nbsp;
            <button className="button" onClick={this.onDispatch}>dispatch</button>
          </div>
          <p>{this.props.count}</p>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default connect(state => ({
  count: state.count
}))(App);

```

## 修改 index.js

```js
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { store } from './store';

ReactDOM.render(
  (<Provider store={store}>
    <App />
  </Provider>), document.getElementById('root'));

serviceWorker.unregister();

```

## 启动项目

```bash
$ npm start

```
