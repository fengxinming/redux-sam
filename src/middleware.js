import { unifyObjectStyle } from './lib/utils';

export default function middleware(sam) {
  return function ({ dispatch }) {
    return function (next) {
      return function (_type, _payload, _options) {
        // 入参兼容
        const action = unifyObjectStyle(_type, _payload, _options);
        const { type, payload, options } = action;

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

          try {
            _actionSubscribers
              .forEach((sub) => {
                const { before } = sub;
                before && before(action, sam.state);
              });
          } catch (e) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(`[redux-sam] error in before action subscribers: `);
              console.error(e);
            }
          }

          const result = entry.length > 1
            ? Promise.all(entry.map(handler => handler(dispatch, payload)))
            : entry[0](dispatch, payload);

          return result.then((res) => {
            try {
              _actionSubscribers
                .forEach((sub) => {
                  const { after } = sub;
                  after && after(action, sam.state);
                });
            } catch (e) {
              if (process.env.NODE_ENV !== 'production') {
                console.warn(`[redux-sam] error in after action subscribers: `);
                console.error(e);
              }
            }
            return res;
          });
        }

        // next 为 createStore 里面的 dispatch 方法
        return next(action);
      };
    };
  };
};
