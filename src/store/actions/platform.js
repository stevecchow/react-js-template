import actionTypes from "../../store/action_types";

/**
 * 设置顶层状态（会全覆盖，非extend）
 * @param {*} state
 * @returns
 */
export const setState = function (state) {
  return {
    type: actionTypes.PLATFORM_SET_STATE,
    payload: state,
  };
};

/**
 * 显示/关闭全局loading
 * @param {*} status
 * @returns
 */
export const loading = function (status) {
  return {
    type: actionTypes.PLATFORM_LOADING,
    payload: status,
  };
};

/**
 * 设置路由信息
 * @param {*} route
 * @returns
 */
export const setRoute = function (route) {
  return {
    type: actionTypes.PLATFORM_SET_ROUTE,
    payload: route,
  };
};

/**
 * 设置SESSION超时状态
 * @param {*} status
 * @returns
 */
export const setSessionTimeout = function (status) {
  return {
    type: actionTypes.PLATFORM_SET_SESSION_TIMEOUT,
    payload: status,
  };
};

/**
 * 设置用户当前工作空间列表、选中工作空间
 * @param {*} workspace
 * @returns
 */
export const setWorkspace = function (workspace = {}) {
  return {
    type: actionTypes.PLATFORM_SET_WORKSPACE,
    payload: workspace,
  };
};

/**
 * 设置侧边栏固定状态
 * @param {*} pin
 * @returns
 */
export const setSidebarPin = function (pin) {
  return {
    type: actionTypes.PLATFORM_SET_SIDEBAR_PIN,
    payload: pin,
  };
};
