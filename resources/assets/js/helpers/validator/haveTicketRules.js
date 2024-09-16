/**
 * This file contains all the validation rules specific to form.
 *
 * RULES : method name for the form should be 'validateFormName'
 * */

import store from '../../../store'
import {Validator} from "../easy-validator";
import {lang} from '../extraLogics';

export function validateHaveTicketSettings(data){

    const { ticket_number, email_address } = data;

    //rules has to apply only after checking conditions
    let validatingData = {
        
        ticket_number: [ticket_number, 'isRequired'],
        
        email_address: [email_address, 'isRequired', 'isEmail'],
    };
    
    //creating a validator instance and pasing lang method to it
    const validator = new Validator(lang);

    const {errors, isValid} = validator.validate(validatingData);

    // write to vuex if errors
    store.dispatch('setValidationError', errors); //if component is valid, an empty state will be sent
  
    return {errors, isValid};
};
