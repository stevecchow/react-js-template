/**
 *
 */
import actionTypes from "../action_types";

const DEFALT_STATE = {
  name: "steve",
  age: 20,
  tel: "13981989247",
  country: "china",
};

const reducer = (state = DEFALT_STATE, action) => {
  const { payload } = action;
  switch (action.type) {
    case actionTypes.PERSONINFO_SET_NAME: {
      return { ...state, ...payload };
    }

    case actionTypes.PERSONINFO_SET_AGE: {
      return { ...state, ...payload };
    }

    case actionTypes.PERSONINFO_SET_TEL: {
      return { ...state, ...payload };
    }

    case actionTypes.PERSONINFO_SET_COUNTRY: {
      return { ...state, ...payload };
    }

    default:
      return state;
  }
};

export default reducer;
