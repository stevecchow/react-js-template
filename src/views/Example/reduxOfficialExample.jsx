import React from "react";
import { connect } from "react-redux";
import actions from "@/store/actions";

const Index = (props) => {
  // 从 props 中解构出 redux 中的 workspace, setWorkspace
  let { workspace, setWorkspace } = props;

  return (
    <div>
      <p>{`the workspace is ${workspace}`}</p>
      <button onClick={setWorkspace("hello")}></button>
    </div>
  );
};

// 设置 mapStateToProps 方法
function mapStateToProps(state) {
  let { workspace } = state.platform;
  return {
    workspace,
  };
}

// 设置 mapDispatchToProps 方法
function mapDispatchToProps(dispatch) {
  return {
    setWorkspace: (workspace) => {
      dispatch(actions.platform.setWorkspace(workspace));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
