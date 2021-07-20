/**
 * 数据状态管理器
 */
import { createStore } from "redux";
import reducers from "./reducers";
import actions from "./actions";

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

/**
 * 执行 action
 * @param {*} group
 * @param {*} name
 * @param {*} arg
 * @returns
 */
export function doAction(group, name, arg = []) {
  if (!actions[group] || !actions[group][name]) {
    console.log(`无效的action[${group}]-[${name}],请检查。`);
    return;
  }

  let action = actions[group][name](...arg);

  if (!action) {
    return;
  }

  store.dispatch(action);
}

/**
 * 获取 store 的值
 * @param {*} group 
 * @param {*} name 
 * @returns 
 */
export function getStoreState(group, name) {
  return store.getState()[group][name];
}

/**
 * 暴露 actions
 * @returns 
 */
export const getActions = function () {
  return actions;
};