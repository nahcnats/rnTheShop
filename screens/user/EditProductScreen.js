// Import libraries
import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, TextInput, ScrollView, StyleSheet, Platform } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector } from 'react-redux';

// Import components
import CustomHeaderButton from '../../components/UI/HeaderButton';

const EditProductScreen = ({ navigation, ...props }) => {
  // Use params if exits, otherwise make it null
  const { productId } = props.route.params ?? {};
  const { submit } = props.route.params ?? {};

  const editedProduct = useSelector(
    state => state.products.userProducts.find(prod => prod.id === productId)
  );
  const [title, setTitle] = useState(editedProduct ? editedProduct.title: '');
  const [imageUrl, setImageUrl] = useState(editedProduct ? editedProduct.imageUrl: '');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState(editedProduct ? editedProduct.description : '');
  const [theParam, setTheParam] = useState();

  useEffect(() => {
    // Mount EditProductScreen

    const submitFn = () => {
      setTheParam(submit);
    }

    // Dynamically set the title header
    navigation.setOptions({
      headerTitle: productId ? 'Edit Product' : 'Add Product',
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title='Add'
            iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'}
            onPress={submitFn}
          />
        </HeaderButtons>
      ),
    });

    navigation.setParams({ submit: submitHandler });

    return () => {
      // unmount
    }
  }, [submitHandler]); // Excute once

  // useEffect(() => {
  //   navigation.setParams({ submit: submitHandler });

  //   return () => {
  //     // unmount
  //   }
  // }, [submitHandler]);

  const submitHandler = useCallback(() => {
    console.log('Submitting');
  }, []);

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
