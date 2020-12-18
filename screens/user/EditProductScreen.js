// Import libraries
import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { Text, View, TextInput, ScrollView, StyleSheet, Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

// Import components
import CustomHeaderButton from '../../components/UI/HeaderButton';

// Import actions
import * as productActions from '../../store/actions/products';

const EditProductScreen = ({ navigation, ...props }) => {

  const { prodId } = props.route.params;

  const editedProduct = useSelector(
    state => state.products.userProducts.find(prod => prod.id === prodId)
  );
  const [title, setTitle] = useState(editedProduct ? editedProduct.title : '');
  const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl : '');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    // Dynamically set the title header
    navigation.setOptions({
      headerTitle: prodId ? 'Edit Product' : 'Add Product',
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title='Add'
              iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
              onPress={submitHandler}
            />
          </HeaderButtons>
        )
      },
    });
  });

  // The use of useCallback is to avoid infinate loop from useLayoutEffect when calling onPress
  const submitHandler = useCallback(() => {
    if (editedProduct) {
      dispatch(productActions.updateProduct(prodId, title, description, imageUrl));
    } else {
      dispatch(productActions.createProduct(title, description, imageUrl, +price));
    }

    navigation.goBack();

  }, [dispatch, prodId, title, description, imageUrl, price]); // Invoke only if prodId, title, decriptions, imageUrl, price changes

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput style={styles.input}
            value={title}
            onChangeText={text => setTitle(text)}
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput style={styles.input}
            value={imageUrl}
            onChangeText={text => setImageUrl(text)}
          />
        </View>
        {
          editedProduct ? null :
          <View style={styles.formControl}>
          <Text style={styles.label}>Price</Text>
          <TextInput style={styles.input}
            value={price}
            onChangeText={text => setPrice(text)}
          />
          </View>
        }
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput style={styles.input}
            value={description}
            onChangeText={text => setDescription(text)}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  formControl: {
    width: '100%'
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  }
});

export default EditProductScreen;
