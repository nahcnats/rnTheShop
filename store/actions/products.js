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
  return async dispatch => {

    try {
      const response = await axios.get(`${API.apiUrl}/products.json`);

      if (!response.status === 200) {
        throw new Error('Something when wrong!');
      }

      const resData = await response.data;
      const loadedProducts = [];

      for (const key in resData) {
        loadedProducts.push(new Product(
          key,
          'u1',
          resData[key].title,
          resData[key].imageUrl,
          resData[key].description,
          resData[key].price
        ));
      }

      dispatch({ type: SET_PRODUCTS, products: loadedProducts });
    } catch (err) {
      throw err;
    }
    
  }
}

export const deleteProduct = productId => {
  return async dispatch => {
    try {
      const response = await axios.delete(`${API.apiUrl}/products/${productId}.json`);

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
  return async dispatch => {
    const payload = { title, description, imageUrl, price };

    const response = await axios.post(`${API.apiUrl}/products.json`,
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
        price
      }
    });  
  }
}

export const updateProduct = (id, title, description, imageUrl) => {
  return async dispatch => {
    try {
      const payload = { title, description, imageUrl };

      const response = await axios.patch(`${API.apiUrl}/products/${id}.json`,
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