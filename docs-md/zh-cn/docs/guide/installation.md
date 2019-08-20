# 安装

```bash
$ npm install --save redux redux-sam react-redux

```

### CommonJS 方式加载

```js
import { createStore } from 'redux-sam';

const { store } = createStore({
  state: { ... },
  mutations: { ... },
  actions: { ... }
  modules: { ... }
}, Component);

export { store };

```

或者

```js
import { createStore, applyMiddleware } from 'redux';
import { Sam, reducer, middleware } from 'redux-sam';

const sam = new Sam({
  state: { ... },
  mutations: { ... },
  actions: { ... }
  modules: { ... }
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
<script>
  // window.reduxSam
  reduxSam.Sam
  reduxSam.middleware
  reduxSam.reducer
  reduxSam.createHelpers
  reduxSam.createStore
</script>

```

```html
<script src="https://cdn.jsdelivr.net/npm/redux-sam/logger.iife.min.js"></script>
<script>
  // window.createSamLogger
</script>

```
