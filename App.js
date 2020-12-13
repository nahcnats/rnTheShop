// Import libraries
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';

// Import redux reducers
import productsReducer from './store/reducers/products';

// Import navigation
import ShopNavigator from './navigation/ShopNavigator'

const rootReducer = combineReducers({
  products: productsReducer
});

const store = createStore(rootReducer);

export default function App() {
  return (
    <Provider store={store}>
      <ShopNavigator />
    </Provider>   
  );
}
