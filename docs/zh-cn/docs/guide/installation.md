# 安装

```bash
$ npm install --save redux redux-sam react-redux

```

### CommonJS 方式加载

```js
import { createStore } from 'redux-sam';
import createLogger from 'redux-sam/logger';

const { store } = createStore({
  state: { ... },
  mutations: { ... },
  actions: { ... },
  modules: { ... },
  plugins: [process.env.NODE_ENV !== 'production' && createLogger()]
}, Component);

export { store };

```

或者

```js
import { createStore, applyMiddleware } from 'redux';
import { Sam, reducer, middleware } from 'redux-sam';
import createLogger from 'redux-sam/logger';

const sam = new Sam({
  state: { ... },
  mutations: { ... },
  actions: { ... },
  modules: { ... },
  plugins: [process.env.NODE_ENV !== 'production' && createLogger()]
});
const store = createStore(
  reducer(sam), 
  sam.state, 
  applyMiddleware(middleware(sam))
);

export { store };

```

### 或者通过 `script` 方式加载

```html
<script src="https://cdn.jsdelivr.net/npm/redux-sam/iife.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/redux-sam/logger.iife.min.js"></script>
<script>
  // window.reduxSam
  var createStore = reduxSam.createStore;

  const { store } = createStore({
    state: { ... },
    mutations: { ... },
    actions: { ... },
    modules: { ... },
    plugins: [process.env.NODE_ENV !== 'production' && createSamLogger()]
  }, Component);
</script>

```

或者

```js
var createStore = Redux.createStore;
var applyMiddleware = Redux.applyMiddleware;
var Sam = reduxSam.Sam;
var reducer = reduxSam.reducer;
var middleware = reduxSam.middleware;

var sam = new Sam({
  state: { ... },
  mutations: { ... },
  actions: { ... },
  modules: { ... },
  plugins: [process.env.NODE_ENV !== 'production' && createLogger()]
});
const store = createStore(
  reducer(sam), 
  sam.state, 
  applyMiddleware(middleware(sam))
);

```
