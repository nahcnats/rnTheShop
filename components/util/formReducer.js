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

export default formReducer;