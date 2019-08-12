import isObject from 'celia/isObject';
import forOwn from 'celia.object/forOwn';

export function assert(condition, msg) {
  if (!condition) {
    throw new Error(`[redux-sam] ${msg}`);
  }
}

export function getNestedState(state, path) {
  return path.length
    ? path.reduce((state, key) => state[key], state)
    : state;
}

export function setNestedState(rootState, path, childState) {
  const lastIndex = path.length - 1;
  const parentState = getNestedState(rootState, path.slice(0, lastIndex));
  const moduleName = path[lastIndex];
  parentState[moduleName] = childState;
}

export function removeNestedState(rootState, path) {
  const lastIndex = path.length - 1;
  const parentState = getNestedState(rootState, path.slice(0, lastIndex));
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

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof type === 'string', `expects string as the type, but found ${typeof type}.`);
  }

  options = options || {};

  return { type, payload, options };
}

const assertTypes = {
  mutations: {
    assert: value => typeof value === 'function',
    expected: 'function'
  },
  actions: {
    assert: value => typeof value === 'function' ||
      (typeof value === 'object' && typeof value.handler === 'function'),
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

export function assertRawModule(path, rawModule) {
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
