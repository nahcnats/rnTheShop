// Import libraries
import React from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';

// Import components
import ProductItem from '../../components/shop/ProductItem';

const ProductsOverviewScreen = ({ navigation, ...props}) => {
  // state.products from app.combinedReducers
  const products = useSelector(state => state.products.availableProducts);

  return <FlatList
    data={products}
    keyExtractor={item => item.id}
    renderItem={itemData => <ProductItem
      image={itemData.item.imageUrl}
      title={itemData.item.title}
      price={itemData.item.price}
      onViewDetail={() => {
        navigation.navigate('ProductDetailScreen', {
          productId: itemData.item.id,
          productTitle: itemData.item.title
        });
      }}
      onAddToCart={() => null}
    />}
  />
}

export default ProductsOverviewScreen;
