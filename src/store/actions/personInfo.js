import actionTypes from "../../store/action_types";

/**
 * 设置顶层状态（会全覆盖，非extend）
 * @param {*} state
 * @returns
 */
export const setName = function (val) {
  return {
    type: actionTypes.PERSONINFO_SET_NAME,
    payload: {
      name: val,
    },
  };
};
