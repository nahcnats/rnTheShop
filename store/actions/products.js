// Import libraries
import axios from 'axios';

// Import models
import Product from '../../models/product';

// Import constants
import API from '../../constants/API';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const CREATE_PRODUCT = 'CREATE_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';

export const fetchProducts = () => {
  return async (dispatch, getState) => {

    try {
      const userId = getState().auth.userId;

      const response = await axios.get(`${API.apiUrl}/products.json`);

      if (!response.status === 200) {
        throw new Error('Something when wrong!');
      }

      const resData = await response.data;
      const loadedProducts = [];

      for (const key in resData) {
        loadedProducts.push(new Product(
          key,
          resData[key].ownerId,
          resData[key].title,
          resData[key].imageUrl,
          resData[key].description,
          resData[key].price
        ));
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
      });
    } catch (err) {
      throw err;
    }
    
  }
}

export const deleteProduct = productId => {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;

      const response = await axios.delete(`${API.apiUrl}/products/${productId}.json?auth=${token}`);

      if (!response.status === 200) {
        throw new Error('Something when wrong!');
      }

      dispatch({ type: DELETE_PRODUCT, pid: productId });
    } catch (err) {
      throw err;
    }
  }
}

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    const payload = {
      title,
      description,
      imageUrl,
      price,
      ownerId: userId
    };

    const response = await axios.post(`${API.apiUrl}/products.json?auth=${token}`,
      payload,
      API.options
    );

    const resData = await response.data;

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
        ownerId: userId
      }
    });  
  }
}

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    try {
      const payload = { title, description, imageUrl };
      const token = getState().auth.token;

      const response = await axios.patch(`${API.apiUrl}/products/${id}.json?auth=${token}`,
        payload,
        API.options
      );

      if (!response.status === 200) {
        throw new Error('Something when wrong!');
      }

      dispatch({
        type: UPDATE_PRODUCT,
        pid: id,
        productData: {
          title,
          description,
          imageUrl
        }
      }); 
    } catch (err) {
      throw err;
    }
  }
}