// Import libraries
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

// Import constants
import API from '../../constants/API';

export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';

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

      dispatch({
        type: SIGNUP,
        token: resData.idToken,
        userId: resData.localId,
        expiryDate: expirationDate
      });

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

      dispatch({
        type: LOGIN,
        token: resData.idToken,
        userId: resData.localId,
        expiryDate: expirationDate
      });
      
      saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    } catch (err) {
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

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem('userData', JSON.stringify({
    token: token,
    userId: userId,
    expiryDate: expirationDate.toISOString()
  }));
}