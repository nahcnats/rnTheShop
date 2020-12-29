// Import libraries
import React, {
  useReducer,
  useCallback,
  useState,
  useEffect
} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';

// Import components
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';

// Import utils
import formReducer from '../../components/util/formReducer';

// Import constants
import Colors from '../../constants/Colors';
import {FORM_INPUT_UPDATE} from '../../constants/actionType';

// Import actions
import * as authActions from '../../store/actions/auth';

const AuthScreen = props => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured!', error, [{ text: 'OK' }]);
    }
  }, [error]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState] // Invoke only is dispatchFormState is called
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false
  });

  const authHandler = async () => {
    let action;

    if (isSignUp) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }

    setError(null);
    setIsLoading(true);

    try {
      await dispatch(action);  
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={50} style={styles.screen}>
      <LinearGradient colors={['#FF6347', 'transparent']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id='email'
              label='E-Mail'
              keybordType='email-address'
              required
              email
              autoCapitalized='none'
              errorText='Please enter a valid email address'
              onInputChange={inputChangeHandler}
            />
            <Input
              id='password'
              label='Password'
              keybordType='default'
              secureTextEntry
              required
              minLength={6}
              autoCapitalized='none'
              errorText='Please enter a valid password'
              onInputChange={inputChangeHandler}
            />
            <View style={styles.buttonContainer}>
              <Button title={isSignUp ? 'Sign Up' : 'Login'}
                color={Colors.primary}
                onPress={authHandler} />
            </View>
            <View style={styles.buttonContainer}>
              {
                isLoading ? <ActivityIndicator size='small' color={Colors.primary} /> :
                <Button title={`Switch to ${isSignUp ? 'Login' : 'Sign Up'}`}
                  color={Colors.accent}
                  onPress={() => { 
                    setIsSignUp(prevState => !prevState);
                    }}
                />
              }
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

export const authScreenOptions = {
  headerTitle: 'Authenticate'
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default AuthScreen;
