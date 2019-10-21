import { unifyObjectStyle, error, info } from './lib/utils';

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
      error(`error in ${method} action subscribers: `, e);
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
    !sam.dispatch && (sam.dispatch = function (_type, _payload, _options) {
      const action = unifyObjectStyle(_type, _payload, _options);
      const { options } = action;
      options.async === undefined && (options.async = true);
      return dispatch(action);
    });

    return function (next) {
      // 挂载 commit 方法 至 sam 对象上，用于同步更新状态
      !sam.commit && (sam.commit = function (_type, _payload, _options) {
        // 入参兼容
        return next(unifyObjectStyle(_type, _payload, _options));
      });

      return function (_type, _payload, _options) {
        // 入参兼容
        const action = unifyObjectStyle(_type, _payload, _options);
        let { options } = action;

        // 触发异步方法
        if (options.async) {
          let { type, payload } = action;
          const { _actions, _actionSubscribers } = sam;

          let entry = _actions[type];
          if (!entry) {
            if (process.env.NODE_ENV !== 'production') {
              // error(`unknown action type: ${type}`);
              info(`unknown action type: ${type}, trying mutation type: ${type} ...`);
            }
            // return;
            entry = [function () {
              return new Promise((resolve) => {
                resolve(next(action));
              });
            }];
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

        // next 为 redux createStore 里面的 dispatch 方法
        return next(action);
      };
    };
  };
};
