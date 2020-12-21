import { LOGIN, SIGNUP } from '../actions/auth';

const initialState = {
  loggedIn: false,
  token: null,
  userId: null
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        loggedIn: action.loggedIn,
        token: action.token,
        userId: action.userId
      }
    }
    // case LOGOUT: {
    //   return {
    //     ...state,
    //     loggedIn: action.trueFalse,
    //     token: null
    //   }
    // }
    case SIGNUP: {
      return {
        ...state,
        token: action.token,
        userId: action.userId
      }
    }
    default:
      return state;
  }
}

export default authReducer;