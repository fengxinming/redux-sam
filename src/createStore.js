import reducer from './reducer';
import middleware from './middleware';
import Sam from './Sam';
import createHelpers from './createHelpers';

let createStore;
let applyMiddleware;
if (typeof window !== 'undefined' && window.Redux) {
  createStore = window.Redux.createStore;
  applyMiddleware = window.Redux.applyMiddleware;
} else {
  try {
    const Redux = require('redux');
    createStore = Redux.createStore;
    applyMiddleware = Redux.applyMiddleware;
  } catch (e) { }
}

/**
 * 创建一个 redux-sam 实例用于解析state、mutations、actions和modules
 *
 * const { store, sam, mapActions, mapMutations } = createStore({
 *   state: { ... },
 *   mutations: { ... },
 *   actions: { ... }
 *   modules: { ... }
 * });
 *
 * export { store, sam, mapActions, mapMutations };
 *
 */
export default function (options, proto) {
  const sam = new Sam(options);
  const store = createStore(
    reducer(sam),
    sam.state,
    applyMiddleware(middleware(sam))
  );
  const { mapActions, mapMutations } = createHelpers(sam);

  // 往组件上挂载自定义函数
  if (proto) {
    const prototypeAccessors = {
      // 挂载store
      $store: {
        configurable: true,
        get() {
          return store;
        }
      },

      // 挂载Sam
      $sam: {
        configurable: true,
        get() {
          return sam;
        }
      }
    };
    Object.defineProperties(proto, prototypeAccessors);

    // 挂载 mapActions
    proto.$mapActions = function (actions, namespace) {
      return mapActions(this, actions, namespace);
    };

    // 挂载 mapMutations
    proto.$mapMutations = function (mutations, namespace) {
      return mapMutations(this, mutations, namespace);
    };
  }

  return { store, sam, mapActions, mapMutations };
};
