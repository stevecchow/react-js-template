import React, { useState, useMemo, useCallback } from "react";
import { Button } from "antd";

const Test = (props) => {
  const [buttonText, setButtonText] = useState("buttonText");
  const [strings, setStrings] = useState("strings");

  // RenderButton
  let RenderButton = useCallback(() => {
    return (
      <h1>
        {console.log("1")}
        {buttonText}
      </h1>
    );
  }, [buttonText]);

  // RenderButton2
  let RenderButton2 = useMemo(() => {
    return (
      <h1>
        {console.log("2")}
        {buttonText}
      </h1>
    );
  }, [buttonText]);

  const RenderButton3 = () => (
    <div>
      {console.log("3")}
      <h1>{buttonText}</h1>
    </div>
  );

  return (
    <div>
      hello test <br />
      <button onClick={() => setStrings(strings + 1)}>click</button>
      <br />
      <button onClick={() => setButtonText(buttonText + 1)}>click</button>
      <br />
      {strings}
      <br />
      <RenderButton />
      <br />
      {RenderButton2}
      <br />
      <RenderButton3 />
    </div>
  );
};

export default Test;
