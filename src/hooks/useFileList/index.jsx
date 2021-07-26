import React, { useState, useEffect, useMemo, useRef } from "react";
import { Modal, Input, message, Table } from "antd";
import {
  MoveToModal,
  CopyToModal,
  GrantModal,
  NewFolderModal,
  FileName,
  Crumb,
} from "@/components/fileManage";
import api from "@/api";
import { deepCompare } from "@/utils";
import { useLoadingState } from "@/utils/react_custom_use";
import classnames from "classnames";
import IconButton from "@/components/IconButton";
import { validName } from "@/utils";
import $ from "jquery";
import SvgIcon from "@/components/SvgIcon";
import { SearchOutlined } from "@ant-design/icons";

/**
 * 获取焦点并全选文本内容
 * @param {DOM Object} ele
 */
function focusAndSelect(ele) {
  $(ele).focus().select();
}

// 初始化获取焦点，并全选内容input
const FocusSelectInput = (props) => {
  const input = useRef(null);

  useEffect(() => {
    focusAndSelect(input.current);
  }, []);

  return <Input ref={input} {...props} />;
};

/**
 * 文件列表管理
 * =================================================================================
 * @param {Object} options 参数对象
 * options.fileIdKey {String} 文件id对应key
 * options.fileNameKey {String} 文件名对应key
 * options.fileIconKey {String} 文件名icon对应key
 * options.updateTimeKey {String} 最后修改时间对应key
 * options.pagination {Boolean} 是否分页
 * options.getFileIcon {Function} 自定义文件名icon
 * options.fileType {String} 文件列表对应文件系统下所属类型。非文件系统列表数据可不传
 * options.workspaceId {String} 工作区ID
 * options.queryFn {Function} 列表查询对应方法
 * options.callback {Object} 回调函数集
 * options.event {Object} 事件集
 * =================================================================================
 * @return {Object} result 返回对象
 * result.grant {Object} 权限hook
 * result.state {Object} 状态
 * result.action {Object} action api
 * result.render {Object} render Function
 * result.elements {Object} 页面元素
 * =================================================================================
 */
export const useFileList = (options) => {
  const {
    fileIdKey = "fileGuid",
    fileNameKey = "fileName",
    fileNameSubKey = "name",
    fileIconKey = "fileType",
    updateTimeKey = "editTime",
    updateTimeKey2 = null,
    fileNameOrderKey = null,
    updateTimeOrderKey = null,
    updateTimeOrderKey2 = null,
    pagination,
    getFileIcon,
    grant,
    fileType,
    workspaceId,
    queryFn,
    doRenameFn,
    callback = {},
    event = {},
  } = options;

  const { willQueryList, didQueryList } = callback;
  const { onFileClick } = event;
  
  // 缓存信息ref
  const ref = useRef({
    // 缓存查询条件
    queryParams: {},
    // 记录操作列按钮点击后对应的所在行数据
    currentRow: null,
  });
  // 搜索关键字
  const [keyword, setKeyword] = useState("");
  // 每页条数
  const [pageSize, setPageSize] = useState(10);
  // 当前页
  const [currentPage, setCurrentPage] = useState(1);
  // 数据总数
  const [total, setTotal] = useState(0);
  // 排序规则
  const [order, setOrder] = useState(null);
  // 表格loading状态
  let [tableLoading, setTableLoading] = useLoadingState(false);
  // 表格数据
  const [list, setList] = useState([]);
  // 面包屑路径列表
  const [crumb, setCrumb] = useState([
    {
      value: "/",
      name: "全部",
    },
  ]);
  // 当前列表对应文件夹ID
  const currentFolder = useMemo(() => {
    // 非文件夹系统，不存在当前文件夹ID
    if (!fileType) {
      return;
    }
    return crumb[crumb.length - 1].value;
  }, [crumb, fileType]);
  // 新建文件夹弹框
  const [newFoldVis, setNewFoldVis] = useState(false);
  // 弹框-移动到...
  const [movePop, setMoveToPop] = useState({
    visible: false,
    data: {},
  });
  // 弹框-复制到...
  const [copyToPop, setCopyToPop] = useState({
    visible: false,
    data: {},
  });
  // 弹框-授权
  const [grantPop, setGrantPop] = useState({
    visible: false,
    data: {},
  });
  // 表格选中行
  const [selectedRow, setSelectedRow] = useState([]);
  // 搜索框输入内容
  const [searchInputValue, setSearchInputValue] = useState("");

  /**
   * 更新列表
   * @param {Boolean} force 是否强制更新，常用于删除新增后主动调用更新列表
   * @param {Boolean} noshowLoading 是否显示刷新动画
   */
  function updateList(force, noshowLoading) {
    if (!queryFn) {
      return;
    }
    let params = {
      workspaceId,
    };

    if (pagination !== false) {
      params.pageNum = currentPage;
      params.pageCount = pageSize;
    }
    // 如果有搜索关键字，参数中加入关键字条件
    if (keyword) {
      params.key = keyword;
    }
    // 参数中写入当前文件夹信息，ps：接口问题，根目录只支持传空
    if (currentFolder) {
      params.folderGuid = currentFolder === "/" ? "" : currentFolder;
    }
    if (order) {
      params.direct = order.direct;
      params.orderBy = order.orderBy;
      if (order.cusOrderBy) {
        params[order.cusOrderBy] = order.direct;
      }
    }
    willQueryList && willQueryList(params);
    // 条件相同，不更新列表，强制更新除外
    if (force !== true && deepCompare(params, ref.current.queryParams)) {
      return;
    }
    // 缓存查询条件
    ref.current.queryParams = params;
    // loading show
    setTableLoading(noshowLoading === false ? false : true);
    // query
    queryFn(params).then(
      (data) => {
        let { list, total, pageNum } = data;
        // loading hide
        setTableLoading(false);

        // 临时兼容，查询无数据，并且当前页大于1，继续查询前一页数据
        if (pagination !== false && list.length === 0 && pageNum > 1) {
          setCurrentPage(pageNum - 1);
          return;
        }
        setList(list);
        setTotal(total);
        // 清除选中行选中状态
        setSelectedRow([]);
        didQueryList && didQueryList(data);
      },
      (err) => {
        // loading hide
        setTableLoading(false);
      }
    );
  }
  // 执行创建文件夹
  function doCreateFolder(name) {
    if (!fileType) {
      return;
    }
    api("file", "createFolder", {
      params: {
        workspaceId,
        folderName: name,
        fileType: fileType,
        parentFolderId: currentFolder,
      },
    }).then((data) => {
      setNewFoldVis(false);
      updateList(true);
    });
  }

  // 执行移动操作
  function doMove(source, target) {
    let urlKey,
      params = {
        destFolderId: target,
        fileId: source.map((item) => item[fileIdKey]).join(","),
      };

    if (source.length > 1) {
      urlKey = "mutiMove";
      params.fileId = source.map((item) => item[fileIdKey]).join(",");
    } else {
      urlKey = "movefile";
      params.fileId = source[0][fileIdKey];
    }

    api("file", urlKey, {
      data: params,
    }).then(() => {
      message.success("移动成功。");
      setMoveToPop({
        visible: false,
        data: {},
      });
      updateList(true);
    });
  }

  // 执行拷贝操作
  function doCopy(source, target, newName) {
    let urlKey,
      params = {
        destFolderId: target,
        fileId: source.map((item) => item[fileIdKey]).join(","),
      };

    if (source.length > 1) {
      urlKey = "mutiCopy";
      params.fileId = source.map((item) => item[fileIdKey]).join(",");
    } else {
      urlKey = source[0].fileType === "etl_job" ? "copyKettle" : "copyfile";
      params.fileId = source[0][fileIdKey];
      params.fileName = newName;
    }

    api("file", urlKey, {
      data: params,
    }).then(() => {
      message.success("复制成功");
      setCopyToPop({
        visible: false,
        data: {},
      });
      setSelectedRow([]);
      // 如果是复制到当前目录，需要刷新列表
      if (currentFolder === target) {
        updateList(true);
      }
    });
  }

  /**
   * 删除文件/文件夹
   * @param {String} fileId 要删除的文件、文件夹id
   * @param {Boolean} batch 是否批量删除
   */
  function doDelete(fileId, batch) {
    let urlKey = batch ? "mutiDelete" : "delete";
    return api("file", urlKey, {
      params: {
        fileId,
      },
    }).then(() => {
      message.success("删除成功");
      updateList(true);
    });
  }

  // 重命名文件/文件夹
  function doRename(record, newName) {
    let fileName = record[fileNameKey];
    let fileGuid = record[fileIdKey];
    let validRet;
    // 名称相同，返回列表模式
    if (newName === fileName) {
      delete record._editName;
      setList([...list]);
      return;
    }
    // 校验名称
    validRet = validName(newName);
    // 名称不合规范，给出错误提示
    if (validRet.result === false) {
      message.error(validRet.errMsg);
      return;
    }
    if (doRenameFn) {
      return doRenameFn(fileGuid, newName);
    }
    // 执行名称修改，并刷新列表
    return api("file", "rename", {
      params: {
        fileName: newName,
        fileId: fileGuid,
      },
    }).then(() => {
      message.success("修改名称成功");
      updateList(true);
    });
  }

  // 暴露外外部的state
  const state = {
    list,
    crumb,
    selectedRow,
    currentFolder,
  };

  // 提供基础action
  const action = {
    updateList,
    setCrumb,
    setKeyword,
    // 新建文件夹
    newFolder() {
      setNewFoldVis(true);
    },
    /**
     * 跳转到指定文件夹
     * @param {String} folderId
     */
    gotoFolder(folderId) {
      let idx;

      // 处于根目录下，不处理
      if (crumb.length === 1) {
        return;
      }

      // 点击当前目录，不跳转
      if (folderId === currentFolder) {
        return;
      }

      idx = crumb.findIndex((v) => v.value === folderId);

      // 未找到要跳转的文件夹，不处理
      if (idx === -1) {
        return;
      }

      setCrumb(crumb.slice(0, idx + 1));
    },
    /**
     * 移动
     * @param {Boolean} batch 是否批量操作
     */
    move(batch) {
      if (batch) {
        if (selectedRow.length === 0) {
          message.warning("请选择要操作的行。");
          return;
        }
        setMoveToPop({
          visible: true,
          data: {
            source: selectedRow,
          },
        });
        return;
      }
      let { currentRow } = ref.current;
      setMoveToPop({
        visible: true,
        data: {
          source: [currentRow],
        },
      });
    },
    /**
     * 复制
     * @param {Boolean} batch 是否批量操作
     */
    copy(batch) {
      if (batch) {
        if (selectedRow.length === 0) {
          message.warning("请选择要操作的行。");
          return;
        }
        setCopyToPop({
          visible: true,
          data: {
            source: selectedRow,
          },
        });
        return;
      }
      let { currentRow } = ref.current;
      setCopyToPop({
        visible: true,
        data: {
          source: [currentRow],
        },
      });
    },
    /**
     * 删除
     * @param {Boolean} batch 是否批量操作
     */
    delete(batch) {
      let rows, fileId, fileName;

      if (batch && selectedRow.length === 0) {
        message.warning("请选择要操作的行。");
        return;
      }

      rows = batch ? selectedRow : [ref.current.currentRow];
      fileId = rows.map((item) => item[fileIdKey]).join(",");
      fileName = rows.length > 1 ? "" : rows[0][fileNameKey];

      Modal.confirm({
        title: "确认框",
        content: `确认删除${fileName}吗？`,
        onOk() {
          doDelete(fileId, rows.length > 1);
        },
      });
    },
    // 重命名
    rename() {
      let { currentRow } = ref.current;
      if (currentRow._editName === true) {
        return;
      }
      list.forEach((item) => {
        if (item.hasOwnProperty("_editName")) {
          delete item._editName();
        }
      });
      currentRow._editName = true;
      setList([...list]);
    },
    // 授权
    grant() {
      let { currentRow } = ref.current;
      setGrantPop({
        visible: true,
        data: currentRow,
      });
    },
    // 刷新
    refresh() {
      setCurrentPage(1);
      updateList(true);
    },
  };

  // 页面元素
  const elements = {
    // 搜索框
    search: (
      <Input
        value={searchInputValue}
        placeholder="请输入搜索关键字"
        prefix={<SearchOutlined />}
        suffix={
          searchInputValue ? (
            <SvgIcon
              type="close-circle"
              className="ant-input-clear-icon"
              onMouseDown={(e) => {
                setSearchInputValue("");
                setKeyword("");
              }}
            />
          ) : null
        }
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
    // 弹框
    modal: {
      newFolderModal: (
        <NewFolderModal
          visible={newFoldVis}
          onOk={(folderName) => {
            doCreateFolder(folderName);
          }}
          onCancel={(e) => {
            setNewFoldVis(false);
          }}
        />
      ),
      copyToModal: fileType ? (
        <CopyToModal
          type={fileType}
          visible={copyToPop.visible}
          source={copyToPop.data.source}
          workspaceId={workspaceId}
          fileNameKey={fileNameKey}
          onOk={(source, target, newName) => {
            doCopy(source, target, newName);
          }}
          onCancel={() => {
            setCopyToPop({
              visible: false,
              data: {},
            });
          }}
        />
      ) : null,
      moveToModal: fileType ? (
        <MoveToModal
          type={fileType}
          visible={movePop.visible}
          source={movePop.data.source}
          workspaceId={workspaceId}
          onOk={(source, target) => {
            if (currentFolder === target) {
              message.error("不能移动到所在目录。");
              return;
            }
            doMove(source, target);
          }}
          onCancel={() => {
            setMoveToPop({
              visible: false,
              data: {},
            });
          }}
        />
      ) : null,
      grantModal: (
        <GrantModal
          visible={grantPop.visible}
          data={grantPop.data}
          workspaceId={workspaceId}
          onOk={() => {}}
          onCancel={() => {
            setGrantPop({
              visible: false,
              data: {},
            });
          }}
        />
      ),
    },
  };

  // UI 渲染
  const render = {
    title(name) {
      let canClick = false;
      if (!name) {
        return null;
      }
      if (keyword) {
        canClick = true;
      }
      return (
        <span
          style={{
            cursor: canClick ? "pointer" : "default",
          }}
          onClick={(e) => {
            if (!canClick) {
              return;
            }
            setKeyword("");
            setSearchInputValue("");
          }}
        >
          {name}
        </span>
      );
    },
    // 文件/文件夹名称
    fileName(record) {
      const { _editName } = record;
      const fileGuid = record[fileIdKey];
      const fileName = record[fileNameKey];
      if (_editName === true) {
        return (
          <FocusSelectInput
            defaultValue={fileName}
            size="small"
            onBlur={(e) => {
              e.stopPropagation();
              doRename(record, e.target.value);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key == "Enter") {
                doRename(record, e.target.value);
              }
            }}
          />
        );
      }
      return (
        <FileName
          data={record}
          fileIconKey={fileIconKey}
          fileNameKey={record[fileNameKey] ? fileNameKey : fileNameSubKey}
          getFileIcon={getFileIcon}
          style={{
            cursor: onFileClick ? "pointer" : "default",
          }}
          onClick={(e, type) => {
            switch (type) {
              case "folder": {
                setCurrentPage(1);
                setCrumb([
                  ...crumb,
                  {
                    value: fileGuid,
                    name: fileName,
                  },
                ]);
                break;
              }
              case "file": {
                onFileClick && onFileClick(record);
                break;
              }
            }
          }}
        />
      );
    },
    /**
     * 顶部工具栏action
     * @param {Array} list action列表
     * @param {Object} extraAction 额外的action实现
     */
    toolbarAction(list, extraAction = {}) {
      let actions = {
        ...action,
        ...extraAction,
      };
      return (
        <div className="page-actions">
          {list.map((item) => {
            let { icon, name, visible, handler, type, render } = item;
            let visibleRet = visible ? visible({ ref, grant }) : true;
            if (visibleRet === false) {
              return null;
            }
            if (type === "custom") {
              return render && render(actions);
            }
            return (
              <IconButton
                key={name}
                onClick={() => {
                  handler && handler(actions);
                }}
                type={icon}
                text={name}
              />
            );
          })}
        </div>
      );
    },
    /**
     * 行级别操作列action
     * @param {Array} list action列表
     * @param {Object} record action列表
     * @param {Object} extraAction 额外的action实现
     */
    rowAction(list = [], record, extraAction = {}) {
      let actions = {
        ...action,
        ...extraAction,
      };
      return (
        <div className="table-row-actions">
          {list.map((item) => {
            let { icon, name, visible, handler } = item;
            let visibleRet = visible ? visible({ record, ref, grant }) : true;

            // 行授权还没有做，暂时屏蔽
            if (name === "授权") {
              return null;
            }

            if (visibleRet === false) {
              return null;
            }
            return (
              <IconButton
                className="table-row-action"
                showText={false}
                text={name}
                type={icon}
                key={name}
                onClick={(e) => {
                  if (record._editName === true) {
                    return;
                  }
                  ref.current.currentRow = record;
                  handler && handler(actions, record);
                  ref.current.currentRow = null;
                }}
              />
            );
          })}
        </div>
      );
    },
    // 面包屑
    crumb() {
      if (!fileType) {
        return null;
      }
      if (keyword) {
        return (
          <div
            className="page-crumb"
            style={{
              marginLeft: 0,
              cursor: "default",
            }}
          >
            /搜索结果
          </div>
        );
      }
      return (
        <Crumb
          list={crumb}
          itemClick={(item) => {
            let { value } = item;
            action.gotoFolder(value);
          }}
        />
      );
    },
    // 表格
    table(columns, scrollY, hasRowKey) {
      let keys =
        hasRowKey === false
          ? {}
          : {
              rowSelection: {
                selectedRowKeys: selectedRow.map((item) => item[fileIdKey]),
                onChange: (selectedRowKeys, selectedRows) => {
                  setSelectedRow(selectedRows);
                },
              },
            };
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

  function onDialogClose(e) {
    updateList(true);
  }

  // 工作区，当前页、当前文件夹发生变化，更新列表
  useEffect(() => {
    if (!workspaceId) {
      return;
    }
    updateList();
  }, [workspaceId, currentPage, pageSize, currentFolder, keyword, order]);

  useEffect(() => {
    window.ievent.off("DIALOG_CLOSE", onDialogClose);
    window.ievent.on("DIALOG_CLOSE", onDialogClose);
    return () => {
      window.ievent.off("DIALOG_CLOSE", onDialogClose);
    };
  });

  return {
    ref,
    grant,
    state,
    action,
    render,
    elements,
  };
};
