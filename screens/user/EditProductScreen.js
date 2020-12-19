// Import libraries
import React, { useLayoutEffect, useCallback, useReducer } from 'react';
import { View, ScrollView, StyleSheet, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

// Import components
import CustomHeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/Input';

// Import actions
import * as productActions from '../../store/actions/products';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };

    const updateValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };

    let updatedFormIsValid = true;
    for (const key in updateValidities) {
      updatedFormIsValid = updatedFormIsValid && updateValidities[key];
    }

    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updateValidities,
    }
  }

  return state;
}

const EditProductScreen = ({ navigation, ...props }) => {
  const { prodId } = props.route.params;
  const editedProduct = useSelector(
    state => state.products.userProducts.find(prod => prod.id === prodId)
  );

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      price: '',
      description: editedProduct ? editedProduct.description : ''
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      price: editedProduct ? true : false,
      description: editedProduct ? true : false
    },
    formIsValid: editedProduct ? true : false
  });

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
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'OK' }
      ]);
      return;
    }

    if (editedProduct) {
      dispatch(productActions.updateProduct(
        prodId,
        formState.inputValues.title,
        formState.inputValues.description,
        formState.inputValues.imageUrl)
      );
    } else {
      dispatch(productActions.createProduct(
        formState.inputValues.title,
        formState.inputValues.description,
        formState.inputValues.imageUrl,
        +formState.inputValues.price)
      );
    }

    navigation.goBack();

  }, [dispatch, prodId, formState]); // Invoke only if prodId, title, decriptions, imageUrl, price changes

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior='padding'
      keyboardVerticalOffset={100}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id='title'
            label='Title'
            errorText='Please enter a valid title!'
            keyboardType='default'
            autoCapitalize='sentences'
            autoCorrect
            returnKeyType='next'
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.title : ''}
            initialValid={!!editedProduct}
            required
          />
          <Input
            id='imageUrl'
            label='Image Url'
            errorText='Please enter a valid image url!'
            keyboardType='default'
            autoCapitalize='sentences'
            returnKeyType='next'
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ''}
            initialValid={!!editedProduct}
            required
          />
          {
            editedProduct ? null :
              <Input
                id='price'
                label='Price'
                errorText='Please enter a valid price!'
                keyboardType='decimal-pad'
                returnKeyType='next'
                onInputChange={inputChangeHandler}
                required
                min={0.1}
            />
          }
          <Input
            id='description'
            label='Description'
            errorText='Please enter a valid description!'
            keyboardType='default'
            autoCapitalize='sentences'
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ''}
            initialValid={!!editedProduct}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: {
    margin: 20
  }
});

export default EditProductScreen;
