// Import libraries
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { LogBox } from 'react-native';

// Import constants
import API from '../../constants/API';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;
LogBox.ignoreLogs([
  "Setting a timer for a long period of time", 
  // name of the error/warning here, or a regex here
]);

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  }
}

export const signup = (email, password) => {
  return async dispatch => {
    try {
      const response = await axios.post(`${API.authSignUpUrl}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        },
        API.options);

      const resData = await response.data;

      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      );

      dispatch(authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      ));

      // For persistent authentication
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    } catch (err) {
      const errorId = err.response.data.error.message;
      let message = 'Something went wrong!';

      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email exists already!'
      } 
      
      throw new Error(message);
    }
  };
}

export const login = (email, password) => {
  return async dispatch => {
    try {
      const response = await axios.post(`${API.authSignInUrl}`,
        {
          email: email,
          password: password,
          returnSecureToken: true
        },
        API.options);

      const resData = await response.data;

      const expirationDate = new Date(
        new Date().getTime() + parseInt(resData.expiresIn) * 1000
      );

      dispatch(authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      ));
      
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    } catch (err) {
      console.log('action login catch')
      const errorId = err.response.data.error.message;
      let message = 'Something went wrong!';

      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!'
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!'
      }
      
      throw new Error(message);
    }
  };
}

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
}

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
}

const setLogoutTimer = (expirationTime) => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  }
}

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem('userData', JSON.stringify({
    token: token,
    userId: userId,
    expiryDate: expirationDate.toISOString()
  }));
}