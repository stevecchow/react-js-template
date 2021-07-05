import request from "./request";
import configMap from "./config";
import axios from "axios";
import $ from "jquery";

/**
 * 获取 api config 配置信息
 * @param {*} name
 * @param {*} urlKey
 * @returns
 */
export function apiItem(name, urlKey) {
  return configMap[name][urlKey] || {};
}

/**
 * 替换 url 参数
 * @param {*} config
 * @returns
 */
function replaceUrlParams(config) {
  let reg = /\$\{(.+?)\}/g;
  let { urlParams, url } = config;
  if (!urlParams) {
    return;
  }
  config.url = url.replace(reg, (match, key) => {
    if (!key) {
      return "";
    }
    return urlParams[key];
  });
}

/**
 * api 服务调用
 * @param {*} name
 * @param {*} urlKey
 * @param {*} userConfig
 * @param {*} isDownload
 * @returns
 */
const apiServiceCall = function (name, urlKey, userConfig, isDownload) {
  let reqConfig;
  let { handler, config } = apiItem(name, urlKey);

  reqConfig = $.extend(true, {}, config, userConfig || {});
  let erHandle = reqConfig.erHandle;
  erHandle && delete reqConfig.erHandle;

  replaceUrlParams(reqConfig);
  return request.request({ ...reqConfig, isDownload }).then(
    (rep) => {
      return handler ? handler(rep) : rep;
    },
    (e) => {
      erHandle && erHandle(e);
      return Promise.reject(e);
    }
  );
};

/**
 * 创建 cancel token
 * @returns
 */
export const createSource = () => {
  const CancelToken = axios.CancelToken;
  return CancelToken.source();
};

export default apiServiceCall;
