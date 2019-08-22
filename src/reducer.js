import assign from 'celia/assign';

export default function reducer(sam) {
  return function (prevState, mutation) {
    prevState = prevState || sam.state;

    const { type, payload } = mutation;
    if (type && type.indexOf('@@redux') === 0) {
      return prevState;
    }

    const entry = sam._mutations[type];
    if (!entry) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`[redux-sam] unknown mutation type: ${type}`);
      }
      return;
    }

    // 是否需要返回一个新对象
    let changed = entry.reduce((lastest, handler) => lastest + (handler(payload) === false ? 0 : 1), 0);

    const currentState = sam.state;
    sam._subscribers.forEach(sub => sub(mutation, currentState));

    return changed ? assign({}, currentState) : currentState;
  };
};
