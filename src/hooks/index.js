/**
 * 用户自定义react Hooks
 */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from "react";
import $ from "jquery";
import { MENU_LIST } from "@/config";
import store from "@/store";
/**
 * 窗口宽高
 */
export const useSize = () => {
  let $window = $(window);
  let [size, setSize] = useState(getSize());

  function getSize() {
    let $window = $(window);
    let $body = $("body");
    return {
      bWidth: $body.width(),
      bHeight: $body.height(),
      wWidth: $window.width(),
      wHeight: $window.height(),
    };
  }

  function resizeHandler(e) {
    setSize(getSize());
  }

  useEffect(() => {
    $window.on("resize.USE", resizeHandler);
    return () => {
      $window.off("resize.USE", resizeHandler);
    };
  }, []);

  return size;
};

/**
 * setInterval
 */
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();

  // 缓存最近一次的callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // 设置间隔执行
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

/**
 * setTimeout
 */
export const useTimeout = (callback, delay) => {
  const savedCallback = useRef();

  // 缓存最近一次的callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // 设置间隔执行
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
};

/**
 * 延迟状态
 * @param {Any} initValue 初始状态值
 * @param {Number} delay 延迟时间ms
 */
export const useLoadingState = (initValue, delay = 0) => {
  const [value, setValue] = useState(initValue);
  const change = function (n) {
    // 处理隐藏loading的时候，增加延迟处理，防止太快，显示不了laoding效果<暂时不用延迟，注释掉>
    // if(n === false){
    //     setTimeout(()=>{
    //         setValue(n);
    //     },delay)
    // }else{
    setValue(n);
    // }
  };

  return [value, change];
};

/**
 * 弹框控制，返回一个对象，这个对象可以操作 state
 * @param {Boolean} visible，不传默认为 false
 * @param {Object} data ，不传默认为 null
 * @returns
 */
export const useModalControl = (visible = false, data = {}) => {
  const [modal, setModal] = useState({
    visible: visible,
    data,
  });

  // show 弹出弹框
  function show(data) {
    // console.log("show data >>> ", data);
    setModal({
      visible: true,
      data,
    });
  }

  // hide 隐藏弹框并清空数据
  function hide() {
    setModal({
      visible: false,
      data: {},
    });
  }

  return {
    modal,
    show,
    hide,
  };
};

/**
 * 权限、license等授权类逻辑
 * @param {Object} permission 当前工作区权限map对象
 */
export const useGrant = () => {
  const [permission, setPermission] = useState(() => {
    return store.getState().platform.permission;
  });
  const [license, setLicense] = useState(() => {
    return store.getState().platform.licence;
  });

  useEffect(() => {
    store.subscribe(function () {
      let { platform } = store.getState();
      let { permission, licence } = platform;
      setPermission(permission);
      setLicense(licence);
    });
  }, []);

  /**
   * 获取单项权限
   * @param {String} key 单项权限Key
   */
  function getPermission(key) {
    return true;
    // if (!key) {
    //     return true;
    // }
    // return permission.$$isAdministrator || permission[key] === true;
  }

  /**
   * 获取license权限
   * @param {String} key lincense key
   */
  function getLicense(key) {
    return true;
    // if (!key) {
    //     return true;
    // }
    // return !!license[key];
  }

  /**
   * 获取综合权限
   * @param {String} permissionKey 单项权限Key
   * @param {String} licenceKey lincense key
   */
  function get(permissionKey, licenceKey) {
    return true;
    // return getPermission(permissionKey) && getLicense(licenceKey);
  }

  const getDefaultRoute = (key) => {
    let route = MENU_LIST.find((v) => v.key === key);
    let res = "";

    if (!route) {
      return res;
    }

    /*获取一级菜单下面的有权限的第一个二级菜单
          route.children.forEach(v => {
              let r = getPermission(v.permission);
              !res && r && (res = v.path);
          }); */

    return route.path;
  };

  return {
    get,
    getPermission,
    getLicense,
    getDefaultRoute,
  };
};

// 防抖
export const useDebounce = (fn, ms = 30, deps = []) => {
  let timeout = useRef().current;
  useEffect(() => {
    if (timeout) clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    timeout = setTimeout(() => {
      fn();
    }, ms);
  }, deps);

  const cancel = () => {
    clearTimeout(timeout);
    timeout = null;
  };

  return [cancel];
};

// 自定义 useState，支持 state 修改完后的 callback 函数
export const useMyState = (initState) => {
  const [state, setState] = useState(initState);
  let isUpdate = useRef();
  const setXState = (state, cb) => {
    setState((prev) => {
      isUpdate.current = cb;
      return typeof state === "function" ? state(prev) : state;
    });
  };
  useEffect(() => {
    if (isUpdate.current) {
      isUpdate.current();
    }
  });

  return [state, setXState];
};
