// reducer.js
import actionType from "./actionType";

function init(initialCount) {
  return {
    count: initialCount,
    total: 10,
    user: {},
    article: [],
  };
}

function reducer(state, action) {
  switch (action.type) {
    case actionType.INSREMENT:
      return { count: state.count + action.payload };
    case actionType.DECREMENT:
      return { count: state.count - action.payload };
    case actionType.RESET:
      return init(action.payload);
    default:
      throw new Error();
  }
}

export { init, reducer };
