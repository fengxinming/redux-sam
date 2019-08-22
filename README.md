# redux-sam

[![npm package](https://nodei.co/npm/redux-sam.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/redux-sam)

> redux-sam is a middleware of Redux for managing state like Vuex.

[![NPM version](https://img.shields.io/npm/v/redux-sam.svg?style=flat)](https://npmjs.org/package/redux-sam)
[![NPM Downloads](https://img.shields.io/npm/dm/redux-sam.svg?style=flat)](https://npmjs.org/package/redux-sam)
[![](https://data.jsdelivr.com/v1/package/npm/redux-sam/badge)](https://www.jsdelivr.com/package/npm/redux-sam)

## [Full Documentation](https://react-hobby.github.io/redux-sam/)

[![redux-sam](https://react-hobby.github.io/redux-sam/img/redux-sam.png)](https://react-hobby.github.io/redux-sam/index.html)

---

## Installation

```bash
$ npm install --save redux redux-sam react-redux

```

### CommonJS style with npm

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

Or

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

### Load `redux-sam` via classical `<script>` tag

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

Or

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

---

## Examples

  - [chat](examples/chat)
  - [counter](examples/counter)
  - [counter-hot](examples/counter-hot)
  - [login](examples/login)
  - [shopping-cart](examples/shopping-cart)
  - [start](examples/start)
  - [todomvc](examples/todomvc)

Running the examples:

```bash
$ npm install
$ npm run dev

```

---

## License

[MIT](https://opensource.org/licenses/MIT)
