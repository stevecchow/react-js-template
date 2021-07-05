/**
 * 统一定义各模块用到的 action 名称
 */
const TYPE_ARR = [
  "PLATFORM_SET_STATE",
  "PLATFORM_LOADING",
  "PLATFORM_SET_ROUTE",
  "PLATFORM_SET_SESSION_TIMEOUT",
  "PLATFORM_SET_WORKSPACE",
  "PLATFORM_SET_SIDEBAR_PIN",
];

const ACTION_TYPES = TYPE_ARR.reduce((prev, cur) => {
  prev[cur] = cur;
  return prev;
}, {});

console.log("ACTION_TYPES >>> ", ACTION_TYPES);

export default ACTION_TYPES;
