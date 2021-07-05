import { combineReducers } from "redux";
import platform from "./platform";
import personInfo from "./personInfo";

export default combineReducers({
  platform,
  personInfo,
});
