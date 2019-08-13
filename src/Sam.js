import isFunction from 'celia/isFunction';
import isString from 'celia/isString';
import { assert, removeNestedState, isProd } from './lib/utils';
import { installModule, genericSubscribe, resetSam } from './lib/samHelper';

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
    sam._contextNamespaceMap = Object.create(null);

    // 初始化state和子模块
    installModule(sam, [], options);

    // 执行插件
    plugins.forEach(plugin => isFunction(plugin) && plugin(sam));
  }

  get state() {
    return this._state;
  }

  set state(v) {
    if (!isProd) {
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

    if (!isProd) {
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

    if (!isProd) {
      assert(Array.isArray(path), `module path must be a string or an Array.`);
    }

    removeNestedState(this, path);

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
