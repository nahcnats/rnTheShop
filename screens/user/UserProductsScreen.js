// Import libraries
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Platform, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Import components
import CustomHeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';

// Import constants
import Colors from '../../constants/Colors';

// Import actions
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = ({navigation, ...props}) => {
  const userProducts = useSelector(state => state.products.userProducts);
  const dispatch = useDispatch();

  useEffect(() => {
    // Mount UserProductsScreen

    // Dynamically set the title header
    navigation.setOptions({
      headerTitle: 'Your Products',
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

  return (
    <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData =>
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {}}
        >
          <Button color={Colors.primary} title='Edit' onPress={() => {

          }} />
          <Button color={Colors.primary} title='Delete' onPress={() => {
            dispatch(productsActions.deleteProduct(itemData.item.id));
          }} />
        </ProductItem>
      }
    />
  );
}

const styles = StyleSheet.create({

});

export default UserProductsScreen;
