import React, { useState } from "react";
import { useDebounce } from "../../utils/hooks";

export const Home = (props) => {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [cancel] = useDebounce(
    () => {
      setB(a);
    },
    2000,
    [a]
  );

  const changeIpt = (e) => {
    setA(e.target.value);
  };
  return (
    <div>
      <input type="text" onChange={changeIpt} />
      {b} {a}
    </div>
  );
};
