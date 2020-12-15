// Import libraries
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';

// Import screens
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';

// Import constants
import Colors from '../constants/Colors';


const Stack = createStackNavigator();

const ProductsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProductsOverviewScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
        },
        headerTitleStyle: {
          fontFamily: 'open-sans-bold'
        },
        headerBackTitleStyle: {
          fontFamily: 'open-sans'
        },
        headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
      }}
    >
      <Stack.Screen
        name='ProductsOverviewScreen'
        component={ProductsOverviewScreen}
        options={{ title: 'All Products' }} />
      <Stack.Screen
        name='ProductDetailScreen'
        component={ProductDetailScreen}
        options={{ title: 'All Products' }} />
    </Stack.Navigator>
  );
}

const ShopNavigator = () => {
  return (
    <NavigationContainer>
      <ProductsNavigator />
    </NavigationContainer>
  )
}

export default ShopNavigator;

