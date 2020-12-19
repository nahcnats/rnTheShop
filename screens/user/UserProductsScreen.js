// Import libraries
import React, { useLayoutEffect } from 'react';
import { FlatList, Platform, Button, Alert } from 'react-native';
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

  // useLayoutEffect to do repaint layout related changes. Keep it separate from useEffect
  // for state changes.
  useLayoutEffect(() => {
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
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title='Add'
            iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
            onPress={() => {
              navigation.navigate('EditProductScreen', { prodId: null });
            }}
          />
        </HeaderButtons>
      ),
    });

  }, [navigation]); // Excute once

  const editProductHandler = (id) => {
    navigation.navigate('EditProductScreen', {prodId: id});
  }

  const deleteHandler = (title, id) => {
    Alert.alert('Are you sure?', `Do you really want to delete ${title}?`,
      [
        { text: 'No', style: 'default' },
        { text: 'Yes', style: 'destructive', onPress: () => {
            dispatch(productsActions.deleteProduct(id));
          }
        },
      ]
    );
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={item => item.id}
      renderItem={itemData =>
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <Button color={Colors.primary} title='Edit' onPress={() => {
            editProductHandler(itemData.item.id);
          }} />
          <Button color={Colors.primary} title='Delete' onPress={
            deleteHandler.bind(this, itemData.item.title, itemData.item.id)}
          />
        </ProductItem>
      }
    />
  );
}

export default UserProductsScreen;
