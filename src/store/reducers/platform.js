/**
 * 平台
 */
import actionTypes from "../actions_types";

const DEFALT_STATE = {
  // 当前路由信息对象
  route: {},
  // 侧边栏
  sidebar: {
    pin: true,
  },
  // 用户登陆信息
  userInfo: {
    userId: "",
    userName: "",
  },
  // 用户工作空间
  workspace: {
    list: [],
    selected: "",
  },
  // 平台级 loading
  loading: true,
  // session 超时状态
  sessionTimeout: false,
  // 系统版本号
  version: "",
  // 所有工作区权限信息
  allPermissionMap: {},
  // 当前工作区权限信息
  permission: {},
  // 系统 licence 信息
  licence: {},
};

const reducer = (state = DEFALT_STATE, action) => {
  let payload = action.payload;
  switch (action.type) {
    case actionTypes.PLATFORM_SET_STATE: {
      let newState = payload;
      return { ...state, ...newState };
    }

    case actionTypes.PLATFORM_LOADING: {
      let status = payload;
      return { ...state, loading: status };
    }

    case actionTypes.PLATFORM_SET_ROUTE: {
      let route = payload;
      return { ...state, route };
    }

    case actionTypes.PLATFORM_SET_WORKSPACE: {
      let workspace = Object.assign({}, state.workspace, payload);
      return { ...state, workspace };
    }

    case actionTypes.PLATFORM_SET_SESSION_TIMEOUT: {
      let sessionTimeout = payload;
      return { ...state, sessionTimeout };
    }

    case actionTypes.PLATFORM_SET_SIDEBAR_PIN: {
      state.sidebar.pin = payload;
      state.sidebar = { ...state.sidebar };
      return { ...state };
    }

    default:
      return state;
  }
};

export default reducer;
