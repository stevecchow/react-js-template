// redux.js
import React, { useReducer, useContext, createContext } from "react";
import { init, reducer } from "./reducer";

const Context = createContext();
const Provider = (props) => {
  const [state, dispatch] = useReducer(reducer, props.initialState || 0, init);
  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
};

export { Context, Provider };
