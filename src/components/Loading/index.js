/**
 * 全局/页面级 loading
 */
import React from "react"; // { useState, useEffect, useMemo }
import "./style.less";

const Loading = (props) => {
  let { className, loading } = props;
  if (loading !== false) {
    loading = true;
  }
  return (
    <div
      style={{ display: loading ? "block" : "none" }}
      className={"loading-wrap" + (className || "")}
    >
      <div className="loading">
        <div className="loading-square"></div>
        <div className="loading-square"></div>
        <div className="loading-square"></div>
        <div className="loading-square"></div>
        <div className="loading-square"></div>
        <div className="loading-square"></div>
        <div className="loading-square"></div>
      </div>
    </div>
  );
};

const PartLoading = (props) => {
  let { className, style, loading } = props;
  if (loading !== false) {
    loading = true;
  }
  style = style || {};

  return (
    <div
      style={{ display: loading ? "flex" : "none", ...style }}
      className={"part-loading-wrap" + (className || "")}
    >
      <i className="part-loading-icon"></i>
      <span>加载中...</span>
    </div>
  );
};

export default Loading;
export { Loading, PartLoading };
