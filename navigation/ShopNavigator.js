// Import libraries
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';

// Import constants
import Colors from '../constants/Colors';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const defaultNavOptions = {
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
}

const ProductsNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ProductsOverviewScreen"
      screenOptions={defaultNavOptions}
    >
      <Stack.Screen
        name='ProductsOverviewScreen'
        component={ProductsOverviewScreen}
      />
      <Stack.Screen
        name='ProductDetailScreen'
        component={ProductDetailScreen}
      />
      <Stack.Screen
        name='CartScreen'
        component={CartScreen}
      />
      <Stack.Screen
        name='OrdersScreen'
        component={OrdersScreen}
      />
    </Stack.Navigator>
  );
}

const OrdersNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={defaultNavOptions}
    >
      <Stack.Screen
        name='OrdersScreen'
        component={OrdersScreen}
      />
    </Stack.Navigator>
  );
}

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={defaultNavOptions}
    >
      <Stack.Screen
        name='UserProductsScreen'
        component={UserProductsScreen}
      />
    </Stack.Navigator>
  );
}

const ShopNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName='Products'
      drawerContentOptions={{
        activeTintColor: Colors.primary
      }}
    >
      <Drawer.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          drawerIcon: drawerConfig => <Ionicons
            name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
            size={23}
            color={drawerConfig.activeTintColor}
          />
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          drawerIcon: drawerConfig => <Ionicons
            name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
            size={23}
            color={drawerConfig.activeTintColor}
          />
        }}
      />
      <Drawer.Screen
        name="Admin"
        component={AdminNavigator}
        options={{
          drawerIcon: drawerConfig => <Ionicons
            name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
            size={23}
            color={drawerConfig.activeTintColor}
          />
        }}
      />
    </Drawer.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <ShopNavigator />
    </NavigationContainer>
  )
}

export default AppNavigator;

