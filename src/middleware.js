import { unifyObjectStyle } from './lib/utils';

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
      .forEach((sub) => {
        const fn = sub[method];
        fn && fn(action, state);
      });
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[redux-sam] error in ${method} action subscribers: `);
      console.error(e);
    }
  }
}

/**
 * redux中间件
 * @param {Sam} sam
 */
export default function middleware(sam) {
  return function ({ dispatch }) {
    // 挂载 commit 方法 至 sam 对象上，用于触发异步函数
    if (!sam.dispatch) {
      sam.dispatch = function (_type, _payload, _options) {
        const action = unifyObjectStyle(_type, _payload, _options);
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
        const action = unifyObjectStyle(_type, _payload, _options);
        let { type, payload, options } = action;

        // 触发异步方法
        if (options.async) {
          const { _actions, _actionSubscribers } = sam;

          const entry = _actions[type];
          if (!entry) {
            if (process.env.NODE_ENV !== 'production') {
              console.error(`[redux-sam] unknown action type: ${type}`);
            }
            return;
          }

          triggerActionSubscribers(_actionSubscribers, 'before', action, sam.state);

          const result = entry.length > 1
            ? Promise.all(entry.map(handler => handler(payload)))
            : entry[0](payload);

          return result.then((res) => {
            triggerActionSubscribers(_actionSubscribers, 'after', action, sam.state);
            return res;
          });
        }

        // next 为 createStore 里面的 dispatch 方法
        return next(action);
      };
    };
  };
};
