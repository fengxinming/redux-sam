import isFunction from 'celia/isFunction';
import isString from 'celia/isString';
import isObject from 'celia/isObject';
import isPromiseLike from 'celia/isPromiseLike';
import append from 'celia/_append';
import forOwn from 'celia.object/forOwn';
import { assert, assertRawModule, getNestedState, setChildState, removeChildState } from './lib/utils';

export default class Sam {

  constructor(options = {}) {
    const { plugins = [] } = options;
    const sam = this;

    // 内部状态
    sam._rawRootModule = options;
    sam._state = Object.create(null);
    sam._actions = Object.create(null);
    sam._actionSubscribers = [];
    sam._mutations = Object.create(null);
    sam._subscribers = [];
    sam._modulesNamespaceMap = Object.create(null);

    // 初始化state和子模块
    installModule(sam, [], options);

    // 执行插件
    plugins.forEach(plugin => plugin(sam));
  }

  get state() {
    return this._state;
  }

  set state(v) {
    if (process.env.NODE_ENV !== 'production') {
      assert(false, `use store.replaceState() to explicit replace store state.`);
    }
  }

  subscribe(fn) {
    return genericSubscribe(fn, this._subscribers);
  }

  subscribeAction(fn) {
    return genericSubscribe(
      isFunction(fn) ? { before: fn } : fn,
      this._actionSubscribers
    );
  }

  replaceState(state) {
    this.rootModule.state = state;
  }

  registerModule(path, rawModule, options = {}) {
    if (isString(path)) {
      path = [path];
    }

    if (process.env.NODE_ENV !== 'production') {
      assert(Array.isArray(path), `module path must be a string or an Array.`);
      assert(path.length > 0, 'cannot register the root module by using registerModule.');
    }

    installModule(
      this,
      path,
      rawModule,
      options.preserveState
    );
  }

  unregisterModule(path) {
    if (isString(path)) {
      path = [path];
    }

    if (process.env.NODE_ENV !== 'production') {
      assert(Array.isArray(path), `module path must be a string or an Array.`);
    }

    removeChildState(this._state, path);

    resetSam(this, this._rawRootModule);
  }

  hotUpdate(newOptions) {
    resetSam(this, newOptions);
  }

}

function genericSubscribe(fn, subs) {
  if (subs.indexOf(fn) === -1) {
    append(subs, fn);
  }
  return () => {
    const i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  };
}

function resetSam(sam, newModule) {
  sam._actions = Object.create(null);
  sam._mutations = Object.create(null);
  sam._modulesNamespaceMap = Object.create(null);

  // 初始化模块
  installModule(sam, [], newModule, true);
}

function installModule(sam, path, rawModule, hot) {
  const isRoot = !path.length;

  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, rawModule);
  }

  const rawState = rawModule.state;
  const state = (isFunction(rawState) ? rawState() : rawState) || Object.create(null);

  const namespace = path.reduce((namespace, key) => namespace + (rawModule.namespaced ? key + '/' : ''), '');

  // 判断不是顶层模块
  if (!isRoot) {
    // 分类指定命名空间的模块
    if (rawModule.namespaced) {
      if (sam._modulesNamespaceMap[namespace] && process.env.NODE_ENV !== 'production') {
        console.error(`[redux-sam] duplicate namespace ${namespace} for the namespaced module ${path.join('/')}`);
      }
      sam._modulesNamespaceMap[namespace] = true;
    }

    // 挂载子模块到跟模块下
    if (!hot) {
      setChildState(sam._state, path, state);
    }
  }

  forOwn(rawModule.mutations, (mutation, key) => {
    const namespacedType = namespace + key;
    registerMutation(sam, namespacedType, mutation, path);
  });

  forOwn(rawModule.actions, (action, key) => {
    const type = action.root ? key : namespace + key;
    const handler = action.handler || action;
    registerAction(sam, type, handler, path);
  });

  forOwn(rawModule.modules, (child, key) => {
    installModule(sam, path.concat(key), child, hot);
  });
}

function registerMutation(sam, type, handler, path) {
  const entry = sam._mutations[type] || (sam._mutations[type] = []);
  handler = handler.bind(sam);

  entry.push((payload) => {
    let ret = handler(getNestedState(sam._state, path), payload);
    if (isObject(ret)) {
      path.length
        ? setChildState(sam._state, path, ret)
        : (sam._state = ret);
    }
    return ret;
  });
}

function registerAction(sam, type, handler, path) {
  const entry = sam._actions[type] || (sam._actions[type] = []);
  handler = handler.bind(sam);

  entry.push((dispatch, payload) => {
    let res = handler({
      dispatch,
      state: getNestedState(sam.state, path),
      rootState: sam.state
    }, payload);
    if (!isPromiseLike(res)) {
      res = Promise.resolve(res);
    }
    return res;
  });
}
