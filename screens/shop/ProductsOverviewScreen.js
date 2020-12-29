// Import libraries
import React, {
  useEffect,
  useState,
  useCallback
} from 'react';
import {
  View,
  Text,
  FlatList,
  Platform,
  Button,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

// Import components
import ProductItem from '../../components/shop/ProductItem';
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Loading from '../../components/UI/Loading';

// Import constants
import Colors from '../../constants/Colors';

// Import redux actions
import * as cartActions from '../../store/actions/cart';
import * as productsActions from '../../store/actions/products';

const ProductsOverviewScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  // state.products from app.combinedReducers
  const products = useSelector(state => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProducts = useCallback(async () => {
    setError(null);
    setIsRefreshing(true);

    try {
      await dispatch(productsActions.fetchProducts());
    } catch (err) {
      setError(err.message);
    }
    setIsRefreshing(false);
  }, [dispatch, setIsLoading, setError]);

  // Invoke when this page is refocused i.e navigate back to this screen from 
  // another screen
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', loadProducts);

    // Clean up. Remove listener
    return () => {
      unsubscribe
    };
  }, [loadProducts]);

  // Fetch initially
  useEffect(() => {
    setIsLoading(true);

    loadProducts().then(() => setIsLoading(false));
  }, [dispatch, loadProducts]); // Invoke only when dispatch & loadProducts is called

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('ProductDetailScreen', {
      productId: id,
      productTitle: title
    })
  }

  if (error) {
    return <View style={styles.centered}>
      <Text>An error occured!</Text>
      <Button title="Try again" onPress={ loadProducts } color={Colors.primary} />
    </View>
  }

  if (isLoading) {
    return <Loading />
  }

  if (!isLoading && products.length === 0) {
    return <View style={styles.centered}>
      <Text>No products found. May start adding some!</Text>
    </View>
  }

  return <FlatList
    onRefresh={loadProducts}
    refreshing={isRefreshing}
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

export const productsOverviewScreenOptions = navData => {
  return {
    headerTitle: 'All Products',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title='Menu'
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {navData.navigation.toggleDrawer()}}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title='Cart'
          iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          onPress={() => {navData.navigation.navigate('CartScreen')}}
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

export default ProductsOverviewScreen;
