import React, { useState, useEffect, useMemo, useRef } from "react";
import { Modal, Input, Breadcrumb, message, Table, Tag, Space } from "antd";
import { AudioOutlined, SearchOutlined } from "@ant-design/icons";

/**
 * hooks内部提供：crumb、search、table、pagination、modal 等组件
 * 这些组件可以进行配置
 * 将各个 element 布局到页面的任何地方，使用统一的 usePage 来管理
 */
export const usePage = (options) => {
  const { grant = {}, callback = {} } = options;

  /**
   * 内部 state
   */
  const [searchInputValue, setSearchInputValue] = useState();
  const [message, setMessage] = useState();
  // 搜索关键字
  const [keyword, setKeyword] = useState("");
  // 面包屑路径列表
  const [crumb, setCrumb] = useState([
    {
      value: "/",
      name: "全部",
    },
  ]);

  /**
   * 暴露外部 actions
   */
  const actions = {};

  /**
   * 暴露外部 ref
   */
  const ref = {};
  //   const grant = {};

  /**
   * 暴露外部 state
   */
  const state = {};

  /**
   * 暴露外部 render
   */
  const render = {
    // 面包屑
    crumb(list) {
      return (
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a>Application Center</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a>Application List</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>An Application</Breadcrumb.Item>
        </Breadcrumb>
      );
    },
    table(columns, scrollY) {
      return (
        <Table
          rowKey={fileIdKey}
          style={{ tableLayout: "fixed", width: "100%" }}
          scroll={{ y: scrollY }}
          loading={{
            indicator: <i className="platform-part-loading-icon" />,
            spinning: tableLoading,
            tip: "加载中",
          }}
          className={classnames([
            "xm-table",
            tableLoading ? "xm-table-loading" : "",
          ])}
          size="middle"
          columns={columns}
          dataSource={list}
          onChange={(pagination, filters, sorter) => {
            let { order, field, columnKey, column } = sorter;
            if (pagination !== false) {
              setCurrentPage(pagination.current);
              setPageSize(pagination.pageSize);
            }
            if (order) {
              let directMap = { ascend: "asc", descend: "desc" };
              let fieldMap = {
                [fileNameKey]: fileNameOrderKey || "file_name",
                [updateTimeKey]: updateTimeOrderKey || "update_time",
                [updateTimeKey2]: updateTimeOrderKey2 || "",
              };
              let direct = directMap[order] || "";
              let orderBy = fieldMap[field];
              let cusOrderBy = column.sortByName;
              setOrder({ direct, orderBy, cusOrderBy });
            } else {
              setOrder(null);
            }
          }}
          pagination={
            pagination === false
              ? false
              : {
                  className: "xm-pagination",
                  showQuickJumper: true,
                  showSizeChanger: true,
                  current: currentPage,
                  pageSize: pageSize,
                  total: total,
                  itemRender(current, type, originalElement) {
                    if (type === "prev") {
                      return <a className="xm-pagination-prev">上一页</a>;
                    }
                    if (type === "next") {
                      return <a className="xm-pagination-next">下一页</a>;
                    }
                    return originalElement;
                  },
                }
          }
          {...keys}
        />
      );
    },
  };

  /**
   * 暴露外部 elements
   */
  const elements = {
    // 搜索框
    search: (
      <Input
        value={searchInputValue}
        placeholder="请输入搜索关键字"
        // prefix={<SearchOutlined />}
        style={{
          width: 300,
          height: 30,
        }}
        onChange={(e) => {
          setSearchInputValue(e.target.value);
        }}
        onPressEnter={(e) => {
          setKeyword(e.target.value);
        }}
        onBlur={(e) => {
          setKeyword(e.target.value);
        }}
      />
    ),
  };
  return {
    // 缓存信息
    ref,
    // 权限
    grant,
    // 状态
    state,
    // 操作
    actions,
    // 渲染
    render,
    // 组件
    elements,
  };
};
