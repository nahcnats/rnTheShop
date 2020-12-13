// Import libraries
import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Image, Button, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';

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
    <View>
      <Text>{selectedProduct.title}</Text>
    </View>
  ); 
}

const styles = StyleSheet.create({

});

export default ProductDetailScreen;
