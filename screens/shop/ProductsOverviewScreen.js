// Import libraries
import React, { useLayoutEffect } from 'react';
import { FlatList, Platform, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Import components
import ProductItem from '../../components/shop/ProductItem';
import CustomHeaderButton from '../../components/UI/HeaderButton';

// Import constants
import Colors from '../../constants/Colors';

// Import redux actions
import * as cartActions from '../../store/actions/cart';

const ProductsOverviewScreen = ({ navigation, ...props}) => {
  // state.products from app.combinedReducers
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
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

  }, [navigation]); // Excute when navigation invoke

  const selectItemHandler = (id, title) => {
    navigation.navigate('ProductDetailScreen', {
      productId: id,
      productTitle: title
    })
  }

  return <FlatList
    data={products}
    keyExtractor={item => item.id}
    renderItem={itemData =>
      <ProductItem
        image={itemData.item.imageUrl}
        title={itemData.item.title}
        price={itemData.item.price}
        onSelect={() => {
          selectItemHandler(itemData.item.id, itemData.item.title);
        }}
      >
        <Button color={Colors.primary} title='View Details' onPress={() => {
          selectItemHandler(itemData.item.id, itemData.item.title);
        }} />
        <Button color={Colors.primary} title='To Cart' onPress={() => {
          dispatch(cartActions.addToCart(itemData.item));
        }} />
      </ProductItem>}
  />
}

export default ProductsOverviewScreen;
