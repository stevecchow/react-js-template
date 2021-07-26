import React from "react"; // { useState, useMemo, useCallback }
import useFriendStatus from "../../hookComponents/useFriendStatus";
import "./index.css";

const Test = (props) => {
  return (
    <div style={{ border: "1px solid #000", overflow: "hidden" }}>
      <div
        style={{
          width: "100px",
          height: "100px",
          background: "#eee",
          float: "left",
        }}
      ></div>
    </div>
  );
};

export default Test;
