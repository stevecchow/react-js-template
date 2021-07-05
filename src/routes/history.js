const history = require("history").createHashHistory();

export default history;

let stackList = [];

window.stackList = stackList;

history.listen((route) => {
  let { pathname } = route;
  stackList.push(pathname);
});

/**
 * 页面路由跳转，并更新状态pathname
 * @param {*} newUrl
 * @param {*} params
 * @returns
 */
export const gotoPage = (newUrl, params) => {
  let oldUrl = history.location.pathname;
  if (newUrl === oldUrl) {
    return;
  }
  history.push({
    pathname: newUrl,
    params,
  });
};

/**
 * 页面回退
 */
export const goBack = () => {
  if (stackList.length) {
    gotoPage(stackList.pop());
  } else {
    gotoPage("/page/home");
  }
};
