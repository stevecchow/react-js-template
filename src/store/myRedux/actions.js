// actions.js
import actionType from "./actionType";
const add = (num) => ({
  type: actionType.INSREMENT,
  payload: num,
});

const dec = (num) => ({
  type: actionType.DECREMENT,
  payload: num,
});

const getList = (data) => ({
  type: actionType.GETLIST,
  payload: data,
});
export { add, dec, getList };
