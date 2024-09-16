import store from '../../../store'

import {Validator} from "../easy-validator";

import {lang} from '../extraLogics';

export function validateSystemSettings (data){

    const { name, system_time_zone, time_format, date_format, max_column } = data;
    
    let validatingData = {

        name : [name, 'isRequired'],

        system_time_zone : [system_time_zone, 'isRequired'],

        time_format : [time_format, 'isRequired'],

        date_format : [date_format, 'isRequired'],

        max_column : [max_column, 'isRequired', {'minValue(1)': lang('column_min_count')}, { 'maxValue(25)' : lang('column_count_validation')}]
    };

    const validator = new Validator(lang);

    const {errors, isValid} = validator.validate(validatingData);

    store.dispatch('setValidationError', errors); //if component is valid, an empty state will be sent
  
    return {errors, isValid};
};
