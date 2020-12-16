// Import libraries
import React, { useEffect } from 'react';
import { FlatList, Text, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Import components
import CustomHeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';

const OrdersScreen = ({navigation, ...props}) => {
  // state.orders from app.combinedReducers
  const orders = useSelector(state => state.order.orders);

  useEffect(() => {
    // Mount OrdersScreen

    // Dynamically set the title header
    navigation.setOptions({
      headerTitle: 'Your Orders',
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title='Menu'
            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
            onPress={() => {navigation.toggleDrawer()}}
          />
        </HeaderButtons>
      ),
    });

    return () => {
      // unmount
    }
  }, [navigation]); // Excute once

  return <FlatList
    data={orders}
    keyExtractor={item => item.id}
    renderItem={itemData => <OrderItem
      amount={itemData.item.totalAmount}
      date={itemData.item.readableDate}
    />}
  />;
}

export default OrdersScreen;
