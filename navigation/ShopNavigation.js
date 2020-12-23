// Import libraries
import React, { useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,} from '@react-navigation/drawer';
import { View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';

// Import screens
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';

// Import constants
import Colors from '../constants/Colors';

// Import actions
import * as authActions from '../store/actions/auth';

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
      initialRouteName="OrdersScreen"
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
      initialRouteName="UserProductsScreen"
      screenOptions={defaultNavOptions}
    >
      <Stack.Screen
        name='UserProductsScreen'
        component={UserProductsScreen}
      />
      <Stack.Screen
        name='EditProductScreen'
        component={EditProductScreen}
      />
    </Stack.Navigator>
  );
}

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AuthScreen"
      screenOptions={defaultNavOptions}
    >
      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
      />

    </Stack.Navigator>
  )
}

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props} >
          <DrawerItemList {...props} />
          <DrawerItem
            label='Logout'
            onPress={() => {
              props.navigation.closeDrawer();
              dispatch(authActions.logout());
             }}
            icon={drawerConfig => <Ionicons
                name={Platform.OS === 'android' ? 'md-log-out' : 'ios-log-out'}
                size={23}
                color={drawerConfig.activeTintColor}
              />}
          />
        </DrawerContentScrollView>
    </View>
  )
}

const ShopNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName='Products'
      drawerContentOptions={{
        activeTintColor: Colors.primary
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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

const ShopNavigation = () => {
  // !! force it to be true / false
  const isAuth = useSelector(state => !!state.auth.token);

  const dispatch = useDispatch();

  useEffect(() => {
    tryLogin();

    return () => {
      // unmount
    }
  }, [tryLogin]);

  /* 
    For persistence authentication.
    AppNavigator cannot be set as async.
    Hence, need to wrap async function for tryLogin as callback to avoid infinate loop.
  */
  const tryLogin = useCallback(async () => {
    const userData = await AsyncStorage.getItem('userData');

    // If no userData, return. Hence, isLoggedIn is still false
    if (!userData) {
      return;
    }

    // AsyncStorage values are string. Covert string to JSON
    const transformedData = JSON.parse(userData);
    const { token, userId, expiryDate } = transformedData;
    const expirationDate = new Date(expiryDate);

    if (expirationDate <= new Date() || !token || !userId) {
      dispatch(authActions.logout());
      return;
    }

    const expirationTime = expirationDate.getTime() - new Date().getTime();
    dispatch(authActions.authenticate(userId, token, expirationTime));

  }, [isAuth]); // Execute whenever isAuth changes

  return (
    <NavigationContainer>
      {isAuth ? <ShopNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}

export default ShopNavigation;