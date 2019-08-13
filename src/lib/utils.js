import isObject from 'celia/isObject';
import isString from 'celia/isString';
import forOwn from 'celia.object/forOwn';

export const isProd = process.env.NODE_ENV === 'production';

/**
 * 断言
 *
 * @param {Boolean} condition
 * @param {String} msg
 */
export function assert(condition, msg) {
  if (!condition) {
    throw new Error(`[redux-sam] ${msg}`);
  }
}

/**
 * 根据路径获取子state
 *
 * @param {Sam} sam
 * @param {Array} path
 */
export function getNestedState(sam, path) {
  const rootState = sam._state;
  return path.length
    ? path.reduce((state, key) => state[key], rootState)
    : rootState;
}

/**
 * 根据路径设置子state
 *
 * @param {Sam} sam
 * @param {Array} path
 * @param {Object} childState
 */
export function setNestedState(sam, path, childState) {
  const len = path.length;
  if (len) {
    const lastIndex = len - 1;
    const parentState = getNestedState(sam, path.slice(0, lastIndex));
    const moduleName = path[lastIndex];
    parentState[moduleName] = childState;
  } else {
    sam._state = childState;
  }
  return childState;
}

/**
 * 移除子state
 *
 * @param {Sam} sam
 * @param {Array} path
 */
export function removeNestedState(sam, path) {
  const lastIndex = path.length - 1;
  const parentState = getNestedState(sam, path.slice(0, lastIndex));
  const moduleName = path[lastIndex];
  delete parentState[moduleName];
}

export function unifyObjectStyle(type, payload, options) {
  let _type;
  if (isObject(type) && (_type = type.type)) {
    options = type.options;
    payload = type.payload;
    type = _type;
  }

  if (!isProd) {
    assert(isString(type), `expects string as the type, but found ${typeof type}.`);
  }

  options = options || {};

  return { type, payload, options };
}

export function normalizeNamespace(fn) {
  return (component, map, namespace) => {
    isString(namespace)
      ? namespace[namespace.length - 1] !== '/' && (namespace += '/')
      : (namespace = '');
    return fn(component, map, namespace);
  };
}

export function normalizeMap(map, callback) {
  return Array.isArray(map)
    ? map.forEach(key => callback(key, key))
    : forOwn(map, callback);
}

/**
 * 通过命名空间查找模块
 *
 * @param {Object} sam
 * @param {String} helper
 * @param {String} namespace
 * @return {Object}
 */
export function getContextByNamespace(sam, helper, namespace) {
  const ctx = sam._contextNamespaceMap[namespace];
  if (!isProd && !ctx) {
    console.error(`[redux-sam] module namespace not found in ${helper}(): ${namespace}`);
  }
  return ctx;
}
