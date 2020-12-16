// Import libraries
import React, { useEffect } from 'react';
import { FlatList, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Import components
import ProductItem from '../../components/shop/ProductItem';
import CustomHeaderButton from '../../components/UI/HeaderButton';

// Import redux actions
import * as cartActions from '../../store/actions/cart';

const ProductsOverviewScreen = ({ navigation, ...props}) => {
  // state.products from app.combinedReducers
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    // Mount ProductOverviewScreen

    // Dynamically set the title header
    navigation.setOptions({
      headerTitle: 'All Products',
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title='Menu'
            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
            onPress={() => {navigation.toggleDrawer()}}
          />
        </HeaderButtons>
      ),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title='Cart'
            iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
            onPress={() => {navigation.navigate('CartScreen')}}
          />
        </HeaderButtons>
      ),
    });

    return () => {
      // unmount
    }
  }, [navigation]); // Excute once

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
      onAddToCart={() => {
        dispatch(cartActions.addToCart(itemData.item));
      }}
    />}
  />
}

export default ProductsOverviewScreen;
