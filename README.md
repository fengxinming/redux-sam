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
$ npm install --save redux react-redux redux-sam

```

### CommonJS style with npm

```js
import { createStore } from 'redux-sam';

const { store } = createStore({
  state: { ... },
  mutations: { ... },
  actions: { ... }
  modules: { ... }
}, Component.prototype);

export { store };

```

Or

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

### Load `redux-sam` via classical `<script>` tag

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

---

## Examples

  - [chat](examples/chat)
  - [counter](examples/counter)
  - [login](examples/login)
  - [todomvc](examples/todomvc)

Running the examples:

```bash
$ npm install
$ npm run dev

```

---

## License

[MIT](https://opensource.org/licenses/MIT)
