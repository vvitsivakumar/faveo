/**
 * This file contains all the validation rules specific to form.
 *
 * RULES : method name for the form should be 'validateFormName'
 * */

import store from "../../../../../../resources/assets/store";

import {Validator} from "../../../../../../resources/assets/js/helpers/easy-validator";

import {lang} from "../../../../../../resources/assets/js/helpers/extraLogics";



/**
 * @param {object} data      emailSettings component data
 * @return {object}          object of errors and isValid (form is valid or not)
 * */
export function validatePackageCreateSettings(data){

    const { name, display_order, description, allowed_tickets, price, validity, kb_link,month_definition,selected_option, credit_type} = data;
    //rules has to apply only after checking conditions
    let validatingData = {
        name: [name, 'isRequired'],
        display_order: [display_order,'minValue(1)', 'isRequired'],
        description: [description, 'isRequired'],
        price: [price, 'isRequired'],
        allowed_tickets :[allowed_tickets, 'isRequired'],
        validity : [validity, 'isRequired'],
        kb_link : [kb_link, 'isUrl']
    };

    if(data.credit_type != 'all'){

        if(data.selected_option == 'after_specific_number_of_days'){

            validatingData['month_definition']=[month_definition,'isRequired','maxValue(31)','minValue(1)']

        }
            validatingData['selected_option']=[selected_option,'isRequired']
    }

    // if(data.credit_type === 1){

    //     validatingData['allowed_tickets'] = [allowed_tickets, 'isRequired']
    // } else {
    //     console.log(data)
    //     validatingData['validity'] = [validity, 'isRequired']
        
    // }
   
       //creating a validator instance and pasing lang method to it
    const validator = new Validator(lang);

    const {errors, isValid} = validator.validate(validatingData);

    // write to vuex if errors
    store.dispatch('setValidationError', errors); //if component is valid, an empty state will be sent
  
    return {errors, isValid};
};

