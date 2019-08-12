# redux-sam

[![npm package](https://nodei.co/npm/redux-sam.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/redux-sam)

> redux-sam is a middleware of Redux for managing state like Vuex.

[![NPM version](https://img.shields.io/npm/v/redux-sam.svg?style=flat)](https://npmjs.org/package/redux-sam)
[![NPM Downloads](https://img.shields.io/npm/dm/redux-sam.svg?style=flat)](https://npmjs.org/package/redux-sam)
[![](https://data.jsdelivr.com/v1/package/npm/redux-sam/badge)](https://www.jsdelivr.com/package/npm/redux-sam)

### [Full Documentation](https://react-hobby.github.io/redux-sam/)

[![redux-sam](https://react-hobby.github.io/redux-sam/img/redux-sam.png)](https://react-hobby.github.io/redux-sam/index.html)

---

## Table of contents

  - [Installation](#Installation)
  - [Example](#Example)

---

## Installation

### Load `redux-sam` via classical `<script>` tag

```html
<script src="https://cdn.jsdelivr.net/npm/redux-sam/iife.min.js"></script>
<script>
  // window.reduxSam
  reduxSam.Sam
  reduxSam.middleware
  reduxSam.reducer
</script>

```

### CommonJS style with npm

```js
import { createStore, applyMiddleware } from 'redux';
import { Sam, reducer, middleware } from 'redux-sam';
const sam = new Sam({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})
const store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));

```

---

## Examples

  - [login](examples/login)

Running the examples:

```bash
$ npm install
$ npm run dev

```

---

## License

[MIT](https://opensource.org/licenses/MIT)
