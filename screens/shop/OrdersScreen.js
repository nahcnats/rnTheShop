// Import libraries
import React, {
  useEffect,
  useState,
  useCallback
} from 'react';
import {
  View,
  FlatList,
  Text,
  Platform,
  StyleSheet,
  Button
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Import components
import CustomHeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import Loading from '../../components/UI/Loading';

// Import constants
import Colors from '../../constants/Colors';

// Import actions
import * as ordersActions from '../../store/actions/orders';

const OrdersScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  // state.orders from app.combinedReducers
  const orders = useSelector(state => state.order.orders);

  const dispatch = useDispatch();

  const loadOrders = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      await dispatch(ordersActions.fetchOrders());
    } catch (err) {
      setError(err.message);
    }
    
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  // Invoke when this page is refocused i.e navigate back to this screen from 
  // another screen
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadOrders);

    // Clean up. Remove listener
    return unsubscribe;
  }, [loadOrders]);

  // Fetch initially
  useEffect(() => {
    loadOrders();
  }, [dispatch, loadOrders]); // Invoke only when dispatch & loadOrders is called

  if (error) {
    return <View style={styles.centered}>
      <Text>An error occured!</Text>
      <Button title="Try again" onPress={ loadProducts } color={Colors.primary} />
    </View>
  }

  if (isLoading) {
    return <Loading />
  }

  if (orders.length === 0) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>No orders found, maybe start ordering some products?</Text>
    </View>
  }

  return <FlatList
    data={orders}
    keyExtractor={item => item.id}
    renderItem={itemData => <OrderItem
      amount={itemData.item.totalAmount}
      date={itemData.item.readableDate}
      items={itemData.item.items}
    />}
  />;
}

export const ordersScreenOptions = navData => {
  return {
      headerTitle: 'Your Orders',
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title='Menu'
            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
            onPress={() => {navData.navigation.toggleDrawer()}}
          />
        </HeaderButtons>
      ),
    }
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default OrdersScreen;
