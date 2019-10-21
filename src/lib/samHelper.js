import isPromiseLike from 'celia/isPromiseLike';
import isFunction from 'celia/isFunction';
import isObject from 'celia/isObject';
import append from 'celia/_append';
import forOwn from 'celia/forOwn';
import { assert, unifyObjectStyle, setNestedState, getNestedState, error } from './utils';

/**
 *  挂载订阅函数
 *
 * @param {Function} fn
 * @param {Array} subs
 */
export function genericSubscribe(fn, subs) {
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
export function resetSam(sam, newModule) {
  sam._actions = Object.create(null);
  sam._mutations = Object.create(null);
  sam._contextNamespaceMap = Object.create(null);

  // 初始化模块
  installModule(sam, [], newModule, true);
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
          error(`unknown local action type: ${args.type}, global type: ${type}`);
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
            error(`unknown local mutation type: ${args.type}, global type: ${type}`);
            return;
          }
        }
        return sam.commit(type, payload, options);
      } else {
        return sam.commit(_type, _payload, _options);
      }
    },

    getState() {
      return getNestedState(sam, path);
    },

    setState(ret) {
      isObject(ret) && setNestedState(sam, path, ret);
      return ret;
    }
  };

  return local;
}

/**
 * 安装模块
 *
 * @param {Sam} sam
 * @param {Array|String} path
 * @param {Object} rawModule
 * @param {Boolean} hot
 */
export function installModule(sam, path, rawModule, hot) {
  const isRoot = !path.length;

  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, rawModule);
  }

  const rawState = rawModule.state;
  const state = (isFunction(rawState) ? rawState() : rawState) || Object.create(null);
  const namespace = path.reduce((namespace, key) => namespace + (rawModule.namespaced ? key + '/' : ''), '');
  const local = makeLocalContext(sam, namespace, path);

  // 判断不是顶层模块
  if (!isRoot) {
    // 分类指定命名空间的模块
    if (rawModule.namespaced) {
      if (process.env.NODE_ENV !== 'production' && sam._contextNamespaceMap[namespace]) {
        error(`duplicate namespace ${namespace} for the namespaced module ${path.join('/')}`);
      }
      sam._contextNamespaceMap[namespace] = local;
    }

    // 挂载子模块到跟模块下
    if (!hot) {
      setNestedState(sam, path, state);
    }
  } else {
    sam._state = state;
  }

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

const assertTypes = {
  mutations: {
    assert: value => isFunction(value),
    expected: 'function'
  },
  actions: {
    assert: value => isFunction(value) ||
      (isObject(value) && isFunction(value.handler)),
    expected: 'function or object with "handler" function'
  }
};

function makeAssertionMessage(path, key, type, value, expected) {
  let buf = `${key} should be ${expected} but "${key}.${type}"`;
  if (path.length > 0) {
    buf += ` in module "${path.join('.')}"`;
  }
  buf += ` is ${JSON.stringify(value)}.`;
  return buf;
}

function assertRawModule(path, rawModule) {
  forOwn(assertTypes, (assertOptions, key) => {
    // mutations 或者 actions
    const obj = rawModule[key];

    forOwn(obj, (value, type) => {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}
