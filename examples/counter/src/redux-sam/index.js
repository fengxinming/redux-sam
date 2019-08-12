/*
 * redux-sam.js v1.0.2-beta.1
 * (c) 2018-2019 Jesse Feng
 * Released under the MIT License.
 */
import isFunction from 'celia/isFunction';
import isString from 'celia/isString';
import isObject from 'celia/isObject';
import isPromiseLike from 'celia/isPromiseLike';
import append from 'celia/_append';
import forOwn from 'celia.object/forOwn';
import assign from 'celia/assign';

function assert(condition, msg) {
  if (!condition) {
    throw new Error(("[redux-sam] " + msg));
  }
}

function getNestedState(state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state;
}

function setNestedState(rootState, path, childState) {
  var lastIndex = path.length - 1;
  var parentState = getNestedState(rootState, path.slice(0, lastIndex));
  var moduleName = path[lastIndex];
  parentState[moduleName] = childState;
}

function removeNestedState(rootState, path) {
  var lastIndex = path.length - 1;
  var parentState = getNestedState(rootState, path.slice(0, lastIndex));
  var moduleName = path[lastIndex];
  delete parentState[moduleName];
}

function unifyObjectStyle(type, payload, options) {
  var _type;
  if (isObject(type) && (_type = type.type)) {
    options = type.options;
    payload = type.payload;
    type = _type;
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof type === 'string', ("expects string as the type, but found " + (typeof type) + "."));
  }

  options = options || {};

  return { type: type, payload: payload, options: options };
}

var assertTypes = {
  mutations: {
    assert: function (value) { return typeof value === 'function'; },
    expected: 'function'
  },
  actions: {
    assert: function (value) { return typeof value === 'function' ||
      (typeof value === 'object' && typeof value.handler === 'function'); },
    expected: 'function or object with "handler" function'
  }
};

function makeAssertionMessage(path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf;
}

function assertRawModule(path, rawModule) {
  forOwn(assertTypes, function (assertOptions, key) {
    // mutations 或者 actions
    var obj = rawModule[key];

    forOwn(obj, function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

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
var Sam = function Sam(options) {
  if ( options === void 0 ) options = {};

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var sam = this;

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
  plugins.forEach(function (plugin) { return isFunction(plugin) && plugin(sam); });
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._state;
};

prototypeAccessors.state.set = function (v) {
  if (process.env.NODE_ENV !== 'production') {
    assert(false, "use sam.replaceState() to explicit replace redux-sam state.");
  }
};

/**
 * 订阅追踪state
 * @param {Function} fn
 */
Sam.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers);
};

/**
 * 可以订阅action触发前后的公共处理逻辑
 * @param {Function} fn
 */
Sam.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(
    isFunction(fn) ? { before: fn } : fn,
    this._actionSubscribers
  );
};

/**
 * 替换state，未来可能会有一些其它逻辑处理
 * @param {Object} state
 */
Sam.prototype.replaceState = function replaceState (state) {
  this._state = state;
};

/**
 * 动态注册state、mutations、actions和modules，可用服务端渲染
 *
 * @param {String|Array} path
 * @param {Object} rawModule
 * @param {Object} options
 */
Sam.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (isString(path)) {
    path = [path];
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  installModule(
    this,
    path,
    rawModule,
    options.preserveState
  );
};

/**
 * 动态移除已加载的模块
 *
 * @param {String|Array} path
 */
Sam.prototype.unregisterModule = function unregisterModule (path) {
  if (isString(path)) {
    path = [path];
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  removeNestedState(this._state, path);

  resetSam(this, this._rawRootModule);
};

/**
 * 热更新时调用
 * @param {Object} newOptions
 */
Sam.prototype.hotUpdate = function hotUpdate (newOptions) {
  resetSam(this, newOptions);
};

Object.defineProperties( Sam.prototype, prototypeAccessors );

/**
 * 构建函数中需要的函数
 *
 * @param {Sam} sam
 * @param {String} namespace
 * @param {Array} path
 */
function makeLocalContext(sam, namespace, path) {
  var hasNamespace = namespace !== '';

  var local = {
    dispatch: function dispatch(_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (hasNamespace && !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !sam._actions[type]) {
          console.error(("[redux-sam] unknown local action type: " + (args.type) + ", global type: " + type));
          return;
        }
      }
      return sam.dispatch(type, payload, options);
    },

    commit: function commit(_type, _payload, _options) {
      if (hasNamespace) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var type = args.type;
        var payload = args.payload;
        var options = args.options;

        if (!options.root) {
          type = namespace + type;
          if (process.env.NODE_ENV !== 'production' && !sam._mutations[type]) {
            console.error(("[redux-sam] unknown local mutation type: " + (args.type) + ", global type: " + type));
            return;
          }
        }
        return sam.commit(type, payload, options);
      } else {
        return sam.commit(_type, _payload, _options);
      }
    },

    getState: function getState() {
      return getNestedState(sam._state, path);
    },

    setState: function setState(ret) {
      if (isObject(ret)) {
        path.length
          ? setNestedState(sam._state, path, ret)
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
  return function () {
    var i = subs.indexOf(fn);
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
  var isRoot = !path.length;

  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, rawModule);
  }

  var rawState = rawModule.state;
  var state = (isFunction(rawState) ? rawState() : rawState) || Object.create(null);

  var namespace = path.reduce(function (namespace, key) { return namespace + (rawModule.namespaced ? key + '/' : ''); }, '');

  // 判断不是顶层模块
  if (!isRoot) {
    // 分类指定命名空间的模块
    if (rawModule.namespaced) {
      if (sam._modulesNamespaceMap[namespace] && process.env.NODE_ENV !== 'production') {
        console.error(("[redux-sam] duplicate namespace " + namespace + " for the namespaced module " + (path.join('/'))));
      }
      sam._modulesNamespaceMap[namespace] = true;
    }

    // 挂载子模块到跟模块下
    if (!hot) {
      setNestedState(sam._state, path, state);
    }
  } else {
    sam._state = state;
  }

  var local = makeLocalContext(sam, namespace, path);

  forOwn(rawModule.mutations, function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(sam, namespacedType, mutation, local);
  });

  forOwn(rawModule.actions, function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(sam, type, handler, local);
  });

  forOwn(rawModule.modules, function (child, key) {
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
function registerMutation(sam, type, handler, ref) {
  var setState = ref.setState;
  var getState = ref.getState;

  var entry = sam._mutations[type] || (sam._mutations[type] = []);
  handler = handler.bind(sam);

  entry.push(function (payload) { return setState(handler(getState(), payload)); });
}

/**
 * 注册action
 * @param {Sam} sam
 * @param {String} type
 * @param {Function} handler
 * @param {Object} param3
 */
function registerAction(sam, type, handler, ref) {
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  var getState = ref.getState;

  var entry = sam._actions[type] || (sam._actions[type] = []);
  handler = handler.bind(sam);

  entry.push(function (payload) {
    var res = handler({
      dispatch: dispatch,
      commit: commit,
      state: getState(),
      rootState: sam.state
    }, payload);
    if (!isPromiseLike(res)) {
      res = Promise.resolve(res);
    }
    return res;
  });
}

/**
 * 触发action订阅
 * @param {Array} actionSubscribers 订阅回调函数集合
 * @param {String} method before或者after方法名
 * @param {Object} action 包括type和payload还有options
 * @param {Object} state 顶层state或者嵌套子state
 */
function triggerActionSubscribers(actionSubscribers, method, action, state) {
  try {
    actionSubscribers
      .forEach(function (sub) {
        var fn = sub[method];
        fn && fn(action, state);
      });
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(("[redux-sam] error in " + method + " action subscribers: "));
      console.error(e);
    }
  }
}

/**
 * redux中间件
 * @param {Sam} sam
 */
function middleware(sam) {
  return function (ref) {
    var dispatch = ref.dispatch;

    // 挂载 commit 方法 至 sam 对象上，用于触发异步函数
    if (!sam.dispatch) {
      sam.dispatch = function (_type, _payload, _options) {
        var action = unifyObjectStyle(_type, _payload, _options);
        action.options.async = true;
        return dispatch(action);
      };
    }

    // 挂载 commit 方法 至 sam 对象上，用于同步更新状态
    if (!sam.commit) {
      sam.commit = dispatch;
    }

    return function (next) {
      return function (_type, _payload, _options) {
        // 入参兼容
        var action = unifyObjectStyle(_type, _payload, _options);
        var type = action.type;
        var payload = action.payload;
        var options = action.options;

        // 触发异步方法
        if (options.async) {
          var _actions = sam._actions;
          var _actionSubscribers = sam._actionSubscribers;

          var entry = _actions[type];
          if (!entry) {
            if (process.env.NODE_ENV !== 'production') {
              console.error(("[redux-sam] unknown action type: " + type));
            }
            return;
          }

          triggerActionSubscribers(_actionSubscribers, 'before', action, sam.state);

          var result = entry.length > 1
            ? Promise.all(entry.map(function (handler) { return handler(payload); }))
            : entry[0](payload);

          return result.then(function (res) {
            triggerActionSubscribers(_actionSubscribers, 'after', action, sam.state);
            return res;
          });
        }

        // next 为 createStore 里面的 dispatch 方法
        return next(action);
      };
    };
  };
}

function reducer(sam) {
  return function (prevState, mutation) {
    prevState = prevState || sam.state;

    var type = mutation.type;
    var payload = mutation.payload;
    if (type && type.indexOf('@@redux') === 0) {
      return prevState;
    }

    var entry = sam._mutations[type];
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(("[redux-sam] unknown mutation type: " + type));
      }
      return;
    }

    // 是否需要返回一个新对象
    var changed = entry.reduce(function (lastest, handler) { return lastest + (handler(payload) === false ? 0 : 1); }, 0);

    var currentState = sam.state;
    sam._subscribers.forEach(function (sub) { return sub(mutation, currentState); });

    return changed ? assign({}, currentState) : currentState;
  };
}

export { Sam, middleware, reducer };
