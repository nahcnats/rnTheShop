// Import libraries
import React, { useLayoutEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

// Import constants
import Colors from '../../constants/Colors';

// Import redux actions
import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = ({ navigation, ...props }) => {
  const { productId, productTitle } = props.route.params;
  // state.products from app.combinedReducers
  const selectedProduct = useSelector(state => state.products.availableProducts.find(prod => prod.id === productId));
  const dispatch = useDispatch();

  // useLayoutEffect to do repaint layout related changes. Keep it separate from useEffect
  // for state changes.
  useLayoutEffect(() => {
    // Mount ProductDetailScreen

    // Dynamically set the title header
    navigation.setOptions({
      headerTitle: productTitle
    });

  }, [navigation]); // Excute when navigation invoke

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button color={Colors.primary} title='Add to Cart' onPress={() => {
          dispatch(cartActions.addToCart(selectedProduct));
        }} />
      </View>
      <Text style={styles.price}>${ selectedProduct.price.toFixed(2) }</Text>
      <Text style={styles.description}>{ selectedProduct.description }</Text>
    </ScrollView>
  ); 
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center'
  },
  price: {
    fontSize: 20,
    fontFamily: 'open-sans-bold',
    color: '#888',
    textAlign: 'center',
    marginVertical: 20
  },
  description: {
    fontSize: 14,
    fontFamily: 'open-sans',
    textAlign: 'center',
    marginHorizontal: 20
  }
});

export default ProductDetailScreen;
