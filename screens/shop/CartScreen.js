// Import libraries
import React, { useLayoutEffect } from 'react';
import { Text, View, FlatList, StyleSheet, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

// Import constants
import Colors from '../../constants/Colors';

// Import components
import CartItem from '../../components/shop/CartItem';

// Import redux actions
import * as cartActions from '../../store/actions/cart';
import * as ordersAction from '../../store/actions/orders';

const CartScreen = ({ navigation, ...props }) => {
  const cartTotalAmount = useSelector(state => state.cart.totalAmount);
  // state.cart from app.combinedReducers
  const cartItems = useSelector(state => {
    const transformedCartItems = [];
    
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum
      });
    }
    return transformedCartItems.sort((a, b) => a.productId > b.productId ? 1 : -1);
  });

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    // Mount CartScreen

    // Dynamically set the title header
    navigation.setOptions({
      headerTitle: 'Your Cart'
    });

  }, [navigation]); // Excute when navigation invoke
  
  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total: <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}</Text></Text>
        <Button
          color={Colors.accent}
          title='Order Now'
          disabled={cartItems.length === 0}
          onPress={() => {
            dispatch(ordersAction.addOrder(cartItems, cartTotalAmount));
          }}
        />
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.productId}
        renderItem={itemData =>
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    margin: 20
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white'
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18
  },
  amount: {
    color: Colors.accent
  }
});

export default CartScreen;
