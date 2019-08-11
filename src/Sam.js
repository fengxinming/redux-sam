import isFunction from 'celia/isFunction';
import isString from 'celia/isString';
import isObject from 'celia/isObject';
import isPromiseLike from 'celia/isPromiseLike';
import append from 'celia/_append';
import forOwn from 'celia.object/forOwn';
import { assert, assertRawModule, unifyObjectStyle, getNestedState, setChildState, removeChildState } from './lib/utils';

/**
 * 创建一个 redux-sam 实例用于解析state、mutations、actions和modules
 *
 * const sam = new Sam({
 *   state: { ... },
 *   mutations: { ... },
 *   actions: { ... }
 *   modules: { ... }
 * });
 *
 * const store = createStore(reducer(sam), sam.state, applyMiddleware(middleware(sam)));
 *
 */
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
    plugins.forEach(plugin => isFunction(plugin) && plugin(sam));
  }

  get state() {
    return this._state;
  }

  set state(v) {
    if (process.env.NODE_ENV !== 'production') {
      assert(false, `use sam.replaceState() to explicit replace redux-sam state.`);
    }
  }

  /**
   * 订阅追踪state
   * @param {Function} fn
   */
  subscribe(fn) {
    return genericSubscribe(fn, this._subscribers);
  }

  /**
   * 可以订阅action触发前后的公共处理逻辑
   * @param {Function} fn
   */
  subscribeAction(fn) {
    return genericSubscribe(
      isFunction(fn) ? { before: fn } : fn,
      this._actionSubscribers
    );
  }

  /**
   * 替换state，未来可能会有一些其它逻辑处理
   * @param {Object} state
   */
  replaceState(state) {
    this._state = state;
  }

  /**
   * 动态注册state、mutations、actions和modules，可用服务端渲染
   *
   * @param {String|Array} path
   * @param {Object} rawModule
   * @param {Object} options
   */
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

  /**
   * 动态移除已加载的模块
   *
   * @param {String|Array} path
   */
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

  /**
   * 热更新时调用
   * @param {Object} newOptions
   */
  hotUpdate(newOptions) {
    resetSam(this, newOptions);
  }

}

/**
 * 构建函数中需要的函数
 *
 * @param {Sam} sam
 * @param {String} namespace
 * @param {Array} path
 */
function makeLocalContext(sam, namespace, path) {
  const hasNamespace = namespace !== '';

  const local = {
    dispatch(_type, _payload, _options) {
      const args = unifyObjectStyle(_type, _payload, _options);
      let { payload, options, type } = args;

      if (hasNamespace && !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !sam._actions[type]) {
          console.error(`[redux-sam] unknown local action type: ${args.type}, global type: ${type}`);
          return;
        }
      }
      return sam.dispatch(type, payload, options);
    },

    commit(_type, _payload, _options) {
      if (hasNamespace) {
        const args = unifyObjectStyle(_type, _payload, _options);
        let { type, payload, options } = args;

        if (!options.root) {
          type = namespace + type;
          if (process.env.NODE_ENV !== 'production' && !sam._mutations[type]) {
            console.error(`[redux-sam] unknown local mutation type: ${args.type}, global type: ${type}`);
            return;
          }
        }
        return sam.commit(type, payload, options);
      } else {
        return sam.commit(_type, _payload, _options);
      }
    },

    getState() {
      return getNestedState(sam._state, path);
    },

    setState(ret) {
      if (isObject(ret)) {
        path.length
          ? setChildState(sam._state, path, ret)
          : (sam._state = ret);
      }
      return ret;
    }
  };

  return local;
}

/**
 *  挂载订阅函数
 *
 * @param {Function} fn
 * @param {Array} subs
 */
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

/**
 * 重置函数
 * @param {Sam} sam
 * @param {Object} newModule
 */
function resetSam(sam, newModule) {
  sam._actions = Object.create(null);
  sam._mutations = Object.create(null);
  sam._modulesNamespaceMap = Object.create(null);

  // 初始化模块
  installModule(sam, [], newModule, true);
}

/**
 * 安装模块
 *
 * @param {Sam} sam
 * @param {Array|String} path
 * @param {*} rawModule
 * @param {*} hot
 */
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
  } else {
    sam._state = state;
  }

  const local = makeLocalContext(sam, namespace, path);

  forOwn(rawModule.mutations, (mutation, key) => {
    const namespacedType = namespace + key;
    registerMutation(sam, namespacedType, mutation, local);
  });

  forOwn(rawModule.actions, (action, key) => {
    const type = action.root ? key : namespace + key;
    const handler = action.handler || action;
    registerAction(sam, type, handler, local);
  });

  forOwn(rawModule.modules, (child, key) => {
    installModule(sam, path.concat(key), child, hot);
  });
}

/**
 * 注册mutation
 * @param {Sam} sam
 * @param {String} type
 * @param {Function} handler
 * @param {Object} param3
 */
function registerMutation(sam, type, handler, {
  setState, getState
}) {
  const entry = sam._mutations[type] || (sam._mutations[type] = []);
  handler = handler.bind(sam);

  entry.push(payload => setState(handler(getState(), payload)));
}

/**
 * 注册action
 * @param {Sam} sam
 * @param {String} type
 * @param {Function} handler
 * @param {Object} param3
 */
function registerAction(sam, type, handler, {
  dispatch, commit, getState
}) {
  const entry = sam._actions[type] || (sam._actions[type] = []);
  handler = handler.bind(sam);

  entry.push((payload) => {
    let res = handler({
      dispatch,
      commit,
      state: getState(),
      rootState: sam.state
    }, payload);
    if (!isPromiseLike(res)) {
      res = Promise.resolve(res);
    }
    return res;
  });
}
