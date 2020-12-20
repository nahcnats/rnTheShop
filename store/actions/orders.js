// Import libraries
import axios from 'axios';

// Load models
import Order from '../../models/order';

// Import constants
import API from '../../constants/API';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
  return async dispatch => {
    try {
      const response = await axios.get(`${API.apiUrl}/orders/u1.json`);

      if (!response.status === 200) {
        throw new Error('Something when wrong!');
      }

      const resData = await response.data;
      const loadedOrders = [];

      for (const key in resData) {
        loadedOrders.push(new Order(
          key,
          resData[key].cartItems,
          resData[key].totalAmount,
          new Date(resData[key].date)
        ));
      }

      dispatch({ type: SET_ORDERS , orders: loadedOrders });
    } catch (err) {
      throw err;
    }
  }
}

export const addOrder = (cartItems, totalAmount) => {
  return async dispatch => {
    const date = new Date();
    
    const payload = {
      cartItems,
      totalAmount,
      date: date.toISOString()
    };

    const response = await axios.post(`${API.apiUrl}/orders/u1.json`,
      payload,
      API.options
    );

    if (!response.status === 200) {
      throw new Error('Something went wrong!');
    }

    const resData = await response.data;

    dispatch({
      type: ADD_ORDER, orderData: {
        id: resData.name,
        items: cartItems,
        amount: totalAmount,
        date: date
      }
    });
  }
}