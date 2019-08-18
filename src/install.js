import isObject from 'celia/isObject';
import isFunction from 'celia/isFunction';

/**
 * 安装组件实例方法和对象
 *
 * @param {Object|Function} proto
 * @param {Object} store, sam, mapActions, mapMutations
 */
export default function (proto, { store, sam, mapActions, mapMutations }) {
  if (isFunction(proto)) {
    proto = proto.prototype;
  }
  if (isObject(proto)) {
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
}
