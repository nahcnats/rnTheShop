// Import libraries
import React, { useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, Button } from 'react-native';
import { useSelector } from 'react-redux';

// Import constants
import Colors from '../../constants/Colors';

const ProductDetailScreen = ({ navigation, ...props }) => {
  const { productId, productTitle } = props.route.params;
  // state.products from app.combinedReducers
  const selectedProduct = useSelector(state => state.products.availableProducts.find(prod => prod.id === productId));

  useEffect(() => {
    // Mount ProductDetailScreen

    // Dynamically set the title header
    navigation.setOptions({
      title: productTitle
    });

    return () => {
      // unmount
    }
  }, []); // Excute once

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.actions}>
        <Button color={Colors.primary} title='Add to Cart' onPress={() => {}} />
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
