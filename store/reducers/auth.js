import { LOGIN, SIGNUP } from '../actions/auth';

const initialState = {
  token: null,
  userId: null,
  expiryDate: null
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {      
      return {
        ...state,
        token: action.token,
        userId: action.userId,
        expiryDate: action.expirationDate,
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