import store from "@/store";
import * as platform from "./platform";
import * as personInfo from "./personInfo";

const actions = {
  platform,
  personInfo,
};

/**
 * 执行action
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

  let action = action[group][name](...arg);

  if (!action) {
    return;
  }

  store.dispatch(action);
}

export default actions;
