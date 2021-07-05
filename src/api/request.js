import axios from "axios";
import { message } from "antd";
import configMap from "./config";
import store from "@/store";
import { doAction } from "@/store/actions";
import { messageCenter, changeStore } from "@/utils";
import qs from "qs";

const service = axios.create({
  baseURL: configMap.BASE_URL,
  timeout: 30000,
});

const SHOW_LOGIN_FORM = () => {
  doAction("platform", "setSessionTimeout", [true]);
};

/**
 * 请求拦截
 */
service.interceptors.request.use(
  (config) => {
    let { method, url, baseURL, isDownload, params } = config;
    config.headers = config.headers || {};
    config.headers["anthorization"] = window._auth;

    if (method === "get" && isDownload) {
      let dUrl = baseURL + url + "?" + qs.stringify(params);
      window.open(dUrl, "_blank");
      return;
    }

    let workspaceId,
      platformConfig = store.getState().platForm;
    try {
      workspaceId = platformConfig.workspace.selected;
      if (workspaceId && !config.noWId) {
        if (config.data && !config.params) {
          !config.data.workspaceId && (config.data.workspaceId = workspaceId);
        } else {
          !config.params && (config.params = {});
          !config.params.workspaceId &&
            (config.params.workspaceId = workspaceId);
        }
      }
    } catch (error) {}
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

/**
 * 相应拦截
 */
service.interceptors.response.use(
  (response) => {
    const res = response.data || {};
    let { code, content, msg } = res;
    let isAlertError = response.config.isAlertError !== false;

    if (
      typeof response.request.response === "string" &&
      response.request.response.toLowerCase().indexOf("<!doctype html>") !== -1
    ) {
      return Promise.reject(res);
    }

    if (code === void 0) {
      return res;
    }

    if (code === 401) {
      messageCenter.loginOut();
      return Promise.reject(res);
    }

    if (code === 302) {
      messageCenter.repeatLogin();
      return Promise.reject(res);
    }

    if (code === 401) {
      return Promise.reject(res);
    }

    if (code === 200) {
      return content;
    } else {
      msg && isAlertError && message.error(msg);
      return Promise.reject(res);
    }
  },
  function (error) {
    console.log("err:", error.response);
    try {
      error.response.content.message &&
        message.error(error.response.content.message);
    } catch (error) {}
    return Promise.reject(error);
  }
);

export default service;
