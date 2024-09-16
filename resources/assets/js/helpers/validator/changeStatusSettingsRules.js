import store from '../../../store'

import {Validator} from "../easy-validator";

import {lang} from '../extraLogics';

export function validateChangeStatusSettings(data){

  const { commnetValue } = data;

    //rules has to apply only after checking conditions
    let validatingData = {
        commnetValue: [commnetValue, 'isRequired']
    };
    
    //creating a validator instance and pasing lang method to it
    const validator = new Validator(lang);

    const {errors, isValid} = validator.validate(validatingData);

    // write to vuex if errors
    store.dispatch('setValidationError', errors); //if component is valid, an empty state will be sent
  
    return {errors, isValid};
}


