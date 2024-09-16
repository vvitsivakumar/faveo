/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
this file will have all the extra logics which is common throughout the project
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import moment from 'moment'

/**
 * computes the amount of time remaining in human readable form
 * @param  {string} time    time string in UTC
 * @return {string}         approx. time string in human readable form.
 *                           for eg. 3 months ago or 3 months from now
 */
export const humanReadableTimeApprox = (time) => {
	if (!time) { //if time is null
		return '---';
	}

	//current time
	var now = moment();
	var oldDate = moment.utc(time);

	//passing difference in time in and unit of time
	const diffInYrsWithUnit = postFixComputer(now.diff(oldDate, 'year'), 'year');

	const diffInMnthsWithUnit = postFixComputer(now.diff(oldDate, 'month'), 'month');

	const diffInDaysWithUnit = postFixComputer(now.diff(oldDate, 'day'), 'day');

	const diffInHrsWithUnit = postFixComputer(now.diff(oldDate, 'hour'), 'hour');

	const diffInMinsWithUnit = postFixComputer(now.diff(oldDate, 'minute'), 'minute');

	const diffInSecsWithUnit = postFixComputer(now.diff(oldDate, 'second'), 'second');

	if (diffInYrsWithUnit) {
		return diffInYrsWithUnit
	}

	if (diffInMnthsWithUnit) {
		return diffInMnthsWithUnit
	}

	if (diffInDaysWithUnit) {
		return diffInDaysWithUnit
	}

	if (diffInHrsWithUnit) {
		return diffInHrsWithUnit
	}

	if (diffInMinsWithUnit) {
		return diffInMinsWithUnit
	}

	if (diffInSecsWithUnit) {
		return diffInSecsWithUnit
	}

}

/**
 * determines the singular(month or months) or plural of time
 *
 * NOTE : this is a helper method for humanReadableTimePassed method and should not be used by any other method
 *
 * @param  {string} timeQuantity Quantity of the time (for eg. '5' in '5 months' is timeQuantity)
 * @param  {string} timeUnit     Unit of the time (for eg. '5' in '5 months' is timeQuantity)
 * @return {string}              combines those to strings to make it 'months'
 */
const postFixComputer = (timeQuantity, timeUnit) => {

	const timePrefix = (timeQuantity < 1) ? 'from now' : 'ago'

	//making time quantity positive
	const timeQuantityModule = Math.abs(timeQuantity);

	if (timeQuantityModule > 0) {
		const postFix = (timeQuantityModule > 1) ? timeUnit + 's' : timeUnit
		return `${timeQuantityModule} ${postFix} ${timePrefix}`
	}

	return false
}

/**
 * computes the amount time that has passed in human readable form
 * @param  {string} time    time string in UTC
 * @return {string}         precise time string,
 *                           for eg. 22 hours 3 mins 56 seconds
 */

//  export const findObjectByKey = (array, key, value) => {
//     for (var i = 0; i < array.length; i++) {
//         if (array[i][key] === value) {
//             return array[i];
//         }
//     }
//     return null;
// }

export const preciseTimeLeft = (time) => {
	if (!time) {//if time is null
		return '---';
	}

	//current time
	let now = moment();
	let futureDate = moment.utc(time);

	const diffInYrs = futureDate.diff(now, 'years');
	const diffInMonth = futureDate.diff(now, 'months');
	const diffInDays = futureDate.diff(now, 'days');
	const diffInHrs = futureDate.diff(now, 'hours');
	const diffInMins = futureDate.diff(now, 'minutes');
	const diffInSecs = futureDate.diff(now, 'seconds');

	if (diffInSecs < 1) {
		return 0;
	}

	if (diffInDays > 0) {
		const postFix = (diffInDays > 1) ? 'days' : 'day';
		return diffInDays + ' ' + postFix;
	}

	const timeString = diffInHrs + ' hr ' + diffInMins % 60 + ' min ' + diffInSecs % 60 + 'sec'
	return timeString;
}

/**
 * finds object in an object array by key
 * for eg.  array =[{id:1, name:'something'},{id:2, name:'something more'}],
 * we call this method like this : findObjectByKey(array, 'id', 1)
 * and we get result like this : {id:1, name:'something'}
 *
 * @param  {array}         array                    array object that has to be searched
 * @param  {string|number} key                      name of the key
 * @param  {string|number} value                    value of the key
 * @return {object|null}                            found object if present else null
 */
export const findObjectByKey = (array, key, value) => {
	for (var i = 0; i < array.length; i++) {
		if (array[i][key] == value) {
			return array[i];
		}
	}
	return null;
}


/**
 * converts english string into language string
 * NOTE: global lang() method is only available in vue components, so it is required to declare again
 *
 * @param {string}  string      english string
 * @return {string}             language string
 */
export const lang = (string) => {
	if( typeof translator !== 'undefined'){
		return (translator.lang[string] ? translator.lang[string] : string);
	}
	return string;
}

/**
 * flattens an array or object by one layer(in an immutable way)
 * For eg. [[1,2,3,4],[5,6]] will become [1,2,3,4,5,6,7]
 *
 *         { key1 : [{id :1},{id:2}], key2: [{id :3},{id:4}] } becomes [{id :1},{id:2},{id :3},{id:4}]
 *
 * @param {array|object} input
 * @return {array}  flattened array|object
 * */
export const flatten = (input) => {

	let flattenObject = Object.keys(input).reduce(function (r, k) {
		return r.concat(input[k]);
	}, []);

	return flattenObject;
}

/**
 * extractonlyid from an array of objects
 * For eg [{id:1,name:'demo'} , {id:2,name:'demo1}] will become ["1" , "2"] as you can see only the id are being extraceted from the array
 *
 *
 * @param {array} array
 * @return{array} array which contains only id
 */
export const extractOnlyId = (array) => {
	if (array.length > 0) {
		return array.map((obj) => {
			return String(obj.id);
		});
	} else {
		return [];
	}

}


/**
 * filterArrayWithKey helps to filter the array with only key which has been given as the input,
 * for eg [{
 *      id:1,
 *      name:"Demo admin",
 *
 * }]
 * @param {Array} array
 * @param {String} key
 */
export const filterArrayWithKey = (array, key) => {

	return array.map((obj) => {
		return String(obj[key]);
	})
}

/**method would help you to fetch name of the particular id from other array
 * for eg: array1=["1"]  array2=[{'id':1 , name:'navin'} , {'id':2 , name:'narshetty'}]
 * fetchNameAsperId would help you to return finalarray=[{'id':1 , name:'navin'}]
 * @param {Array} value
 * @param {Array} listdata
 */
export const fetchNameAsPerId = (value, listdata) => {
	let finalArray = [];
	finalArray = listdata.filter(elements => {
		return value.includes(elements.id.toString());
	});
	return finalArray;
}

/**
 * multiFilterArray would help you to filter the array based on the the given filter values ,
 * for eg
 * let products = [
  { name: "A", color: "Yellow", size: 50 },
  { name: "B", color: "Blue", size: 60 },
  { name: "C", color: "Black", size: 70 },
  { name: "D", color: "Green", size: 50 },
 *   ];
 *
 * Usage : let filters = {
  color: ["Blue", "Black"],
 * };
 * var filtered = multiFilter(products, filters);
 * expected output would give you
 * [
  { name: "A", color: "Yellow", "size": 50 },
  { name: "D", color: "Green", "size": 50 }
	]
 * @param {Array} array
 * @param {Object} filterValues
 */
export const multiFilterArray = (array, filterValues) => {
	const filterKeys = Object.keys(filterValues);
	return array.filter((item) => {
		return filterKeys.every(key => {
			if (!filterValues[key].length) {
				return true;
			}
			return !filterValues[key].includes(item[key]);
		}
		);
	});

}

/**changeKeyNames is function which is being used to alert the key name in object;
 * for eg if the value passed is "First name" then changeKeyNames would return "first_name"
 * another eg if the value passed is "email"then changeKeyNames would return "email"
 *
 * @param {string} value ;
 * @returns {string} x;
 */
export const changeKeyNames = (value) => {
	let x = value.toLowerCase()
		.split(" ")
		.join("_");
	return x;
};



/**
 * Method Helps to fetch  a particular value from an nested array of objects,
 * For Eg Consedier a Dummy Array show below and i want to fetch the id value of 8 which is inside 3 level,
 * of nesting .
 *  Array:[{
 *      name:'abc',
 *      description:'developer',
 *      id:'3',
 *      subdev:[{
 *          name:'edf',
 *          description:'jr developer'
 *          id:'4'
 *          dev:[]
 *      },{
 *          name:'ghi',
 *          description:'jr developer2'
 *          id:'5'
 *          dev:[]
 *      },{
 *          name:'jkl',
 *          description:'jr developer3'
 *          id:'6',
 *          dev:[{
 *              name:'pqr',
 *              description:'intern',
 *              id:'8'
 *          }]
 *      },{
 *          name:'mno',
 *          description:'jr developer4'
 *          id:'7',
 *          dev:[],
 *      }]
 * }]
 *
 * Usage getValueFromNestedArray(Array , 'pqr , 'id');
 * @param {Array} editDataValues  // Array in which we need to fetch the required value
 * @param {String} valueToBeMatched  // match unique value
 * @param {String} requiredValueFromArray // Which value of id need to be returened
 */
export const getValueFromNestedArray = (editDataValues, valueToBeMatched, requiredValueFromArray) => {
	var result = "";
	if (editDataValues instanceof Array) {
		for (var i = 0; i < editDataValues.length; i++) {
			// looping over it and calling getValueFromNestedArray everytime
			result = getValueFromNestedArray(
				editDataValues[i],
				valueToBeMatched,
				requiredValueFromArray
			);
			if (result) {
				break;
			}
		}
	} else {
		for (var prop in editDataValues) {
			// looping over editDataValues, prop will be index. So this if will not be executed
			if (editDataValues[prop] === valueToBeMatched) {
				// taking id instance from editDataValues
				result = editDataValues[requiredValueFromArray];
				if (result) {
					break;
				}
			}

			// editValue will be an array
			if ((editDataValues[prop] instanceof Object || editDataValues[prop] instanceof Array)

				// HelpTopic and department has nodes in its value which contains custom form, which also has an id parameter
				// that value should not be recursed  as that can cause duplicate `id` attributes which can cause unexpected results
				// NOTE: this can be removed once multi-form is implemented
				&& prop != 'value'
			) {
				result = getValueFromNestedArray(
					editDataValues[prop],
					valueToBeMatched,
					requiredValueFromArray
				);
				if (result) {
					break;
				}
			}
		}
	}
	return result;
};


/**
 * gets the last integer from a given url(string)
 * NOTE: it is a workaround to fetch ids from urls (especially where baseUrl contains '/') until vue-routing is implemented
 * @param  {string} url  url with/without Id
 * @return {integer}     id
 */
export const getIdFromUrl = (url) => {

	let urlArray = url.split("/");

	let idArray = urlArray.filter(function (item) {
		return (parseInt(item) == item);
	});

	return idArray[idArray.length - 1];
};

/**
 * Removes duplicate entries from an array and return unique array without mutating the original array
 * @param  {Array} array that with duplicate entries
 * @return {Array} array with unique entries
 */
export const arrayUnique = (array) => {
	return array.filter((elem, index, self) => (index == self.indexOf(elem)));
};

/**
 * Converts given string into boolean based on php rules
 * for eg. `0` means false, '1' means true, null means false
 * @return {any}
 */
export const boolean = (value) => {

	//for checking if variable is an empty array
	if (Array.isArray(value) && value.length === 0) {
		return false;
	}

	switch (value) {
		case 0:
			return false;

		case '0':
			return false;

		case null:
			return false;

		case "":
			return false;

		case undefined:
			return false;

		case false:
			return false;

		default:
			return true;
	}
};

/**
 * gets the substring value of a given string
 * @param  {string} name
 * @param  {count} number of letters
 * @return {string}     string
 */
export const getSubStringValue = (name,count) => {
	if(name){
		if(name.length>count){
			return name.substring(0,count) + '...';
		} else {
			return name;
		}
	}
};

/**
 * Password length validation
 * @param  {string} password
 * @return {string} string
 */
export const passwordLengthValidation = (password) => {
	
	var strength = 0;

	if(password.length===0) {

		return 'null';

	} else if (password.length <= 7) {

		return 'too_short'; 

	} else {

		strength += 1;

		// If password contains both lower and uppercase characters, increase strength value.
		if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) { strength += 1; }
						
		// If it has numbers and characters, increase strength value.
		if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) { strength += 1; }
						
		// If it has one special character, increase strength value.
		if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) { strength += 1; }
						
		// If it has two special characters, increase strength value.
		if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) { strength += 1; }
		// matches regex
		if (password.match(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}/)) { strength += 1; }
	}
					
	// Calculated strength value, we can return messages
	if (strength <= 2) { return 'your_password_must_be_8_character'; }

	else if (strength <5) { return 'weak'; }

	else { return 'strong'; }
};


/**
 * @param {Number} value
 * @param {String} currency
 * @param {String} language
 * 
 * @returns {String} formated currency with symbol
 * 
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
 */
export const currencyFormatter = (value, currency, lang = "en") => {

  // if `currency` is undefined or empty set it to default USD
  if(typeof currency === "undefined" || currency === "") {
	currency = "USD";
  }
  try {
	return new Intl.NumberFormat(lang, { style: 'currency', currency: currency }).format(value);
  } catch (e){
	// If any exception cought return default symbol as USD
	return new Intl.NumberFormat("en", { style: 'currency', currency: "USD" }).format(value);
  }

};

/**
 * Delay the execution
 * @param ms => time to delay(in milisecond)
 */
export const customDelay = (function(){
  var timer = 0;
  return function(callback, ms){
	clearTimeout (timer);
	timer = setTimeout(callback, ms);
  };
})();


/**
 * Using third party api to get client location by their IP
 * https://about.ip2c.org/#about
 * Using `fetch` to bypassing cors errors
 * https://github.com/axios/axios/issues/1358
 */
export const getCountry = () => {
	 return fetch('https://ip2c.org/s')
		  .then((response) => response.text())
		  .then((response) => {
				const result = (response || '').toString();
				if (!result || result[0] !== '1') {
					 throw new Error('unable to fetch the country');
				}
				return result.substr(2, 2);
		  });
}


/**
 * 
 * @param {String} carbonFormat 
 * 
 * Convert php date-time format to momentjs format
 * Ex- "F j, Y g:i  a" => "MMMM DD, Y hh:mm  a"
 */
export const carbonToMomentFormatter = (carbonFormat) => {
	if(!carbonFormat){
		return "LLL";
	}

	const momentFormat = carbonFormat.replace('m','MM')
		.replace('d','DD').replace('i','mm')
		.replace('s','ss').replace('H','HH')
		.replace('F','MMMM').replace('g','hh')
		.replace('j','DD').replace('S','');

	return momentFormat;
}

/**
 * 
 * @param {String} format 
 * 
 * returns current date-time with the provided time format
 */
export const getCurrentFormattedTime = (format) => {
	return moment(new Date()).format(format);
}

/**
 * Randomly generate color for chart
 * 
 * @param {Number} length
 * @returns {Array} `colorArray`
 */
export const getRandomColor = (length = 1) => {
  let colorArray = [];
  for (let i = 0; i < length; i++) {
	 const letters = '0123456789ABCDEF'.split('');
	 let color = '#';
	 for (let j = 0; j < 6; j++) {
		color += letters[Math.floor(Math.random() * 16)];
	 }
	 colorArray.push(color);
  }
  return colorArray;
}

export const setPreDefinedColor = (length = 1) => {
	// Predefined array of colors
	const predefinedColors = [
		'rgba(128, 217, 241, 0.6)',
		'rgba(127, 200, 216, 0.6)',
		'rgba(89, 180, 195, 0.6)',
		'rgba(95, 183, 255, 0.6)',
		'rgba(103, 169, 255, 0.6)',
		'rgba(0, 141, 218, 0.6)',
		'rgba(55, 140, 231, 0.6)',
		'rgba(56, 122, 223, 0.6)',
		'rgba(18, 64, 118, 0.6)',
		'rgba(65, 201, 226, 0.6)',
		'rgba(105, 158, 255, 0.6)',
		'rgba(165, 195, 205, 0.6)',
		'rgba(181, 187, 255, 0.6)',
		'rgba(225, 194, 241, 0.6)',
		'rgba(212, 148, 238, 0.6)',
		'rgba(121, 128, 255, 0.6)',
		'rgba(74, 107, 150, 0.6)',
		'rgba(83, 86, 255, 0.6)',
		'rgba(118, 171, 174, 0.6)',
		'rgba(143, 213, 229, 0.6)',
		'rgba(196, 239, 244, 0.6)',
		'rgba(145, 149, 246, 0.6)',
		'rgba(172, 226, 225, 0.6)',
		'rgba(103, 198, 227, 0.6)',
		'rgba(204, 238, 255, 0.6)',
		'rgba(204, 238, 187, 0.6)',
		'rgba(255, 230, 204, 0.6)',
		'rgba(255, 204, 229, 0.6)',
		'rgba(204, 229, 255, 0.6)',
		'rgba(255, 204, 204, 0.6)',
		'rgba(229, 204, 255, 0.6)',
		'rgba(255, 255, 204, 0.6)',
		'rgba(204, 255, 255, 0.6)',
		'rgba(242, 255, 204, 0.6)',
	];

	// Function to darken a color

	let colorArray = [];
	for (let i = 0; i < length; i++) {
		const index = i % predefinedColors.length; // Cycling through predefined colors
		let color = predefinedColors[index];
		colorArray.push(color);
	}

	return colorArray;
};

export const setPreDefinedBorderColor = (length = 1) => {
	// Predefined array of colors
	const predefinedColors = [
	'rgba(128, 217, 241, 0.9)',
	'rgba(127, 200, 216, 0.9)',
	'rgba(89, 180, 195, 0.9)',
	'rgba(95, 183, 255, 0.9)',
	'rgba(103, 169, 255, 0.9)',
	'rgba(0, 141, 218, 0.9)',
	'rgba(55, 140, 231, 0.9)',
	'rgba(56, 122, 223, 0.9)',
	'rgba(18, 64, 118, 0.9)',
	'rgba(65, 201, 226, 0.9)',
	'rgba(105, 158, 255, 0.9)',
	'rgba(165, 195, 205, 0.9)',
	'rgba(181, 187, 255, 0.9)',
	'rgba(225, 194, 241, 0.9)',
	'rgba(212, 148, 238, 0.9)',
	'rgba(121, 128, 255, 0.9)',
	'rgba(74, 107, 150, 0.9)',
	'rgba(83, 86, 255, 0.9)',
	'rgba(118, 171, 174, 0.9)',
	'rgba(143, 213, 229, 0.9)',
	'rgba(196, 239, 244, 0.9)',
	'rgba(145, 149, 246, 0.9)',
	'rgba(172, 226, 225, 0.9)',
	'rgba(103, 198, 227, 0.9)',
	'rgba(204, 238, 255, 0.9)',
	'rgba(204, 238, 187, 0.9)',
	'rgba(255, 230, 204, 0.9)',
	'rgba(255, 204, 229, 0.9)',
	'rgba(204, 229, 255, 0.9)',
	'rgba(255, 204, 204, 0.9)',
	'rgba(229, 204, 255, 0.9)',
	'rgba(255, 255, 204, 0.9)',
	'rgba(204, 255, 255, 0.9)',
	'rgba(242, 255, 204, 0.9)',
	];

	// Function to loop color

	let colorArray = [];
	for (let i = 0; i < length; i++) {
		const index = i % predefinedColors.length; // Cycling through predefined colors
		let color = predefinedColors[index];
		colorArray.push(color);
	}

	return colorArray;
};


export const getApiParamsFromArray = (filterOptions,value) => {

	let params = '';

	for( var i in filterOptions){

		for(var j in filterOptions[i].section){

			if(value[filterOptions[i].section[j].name]){

				filterOptions[i].section[j].value = value[filterOptions[i].section[j].name];

				let fieldValue = value[filterOptions[i].section[j].name];

				let fieldName = filterOptions[i].section[j].name;

				let fieldType = filterOptions[i].section[j].type;

				if(filterOptions[i].section[j].isCustom) {

					params +=  fieldName+'=' + value[filterOptions[i].section[j].name] + '&'
				} else {

					if(fieldType === 'date'){

						if(fieldValue.includes('last::') ){

							params +=  filterOptions[i].section[j].name+ '=' + fieldValue + '&'

						} else {

							let value = 'date::' + fieldValue.map(date => moment(date).format('YYYY-MM-DD+HH:mm:ss')).join('~');

							params +=  filterOptions[i].section[j].name+ '=' + value + '&'
						}
					} else if(fieldType === 'number'){

						params +=  fieldName+'_begin=' + value[filterOptions[i].section[j].name].min + '&'+fieldName+'_end=' + value[filterOptions[i].section[j].name].max + '&'

					} else if(fieldType === 'time'){
						// Time field in filter
						params +=  fieldName+'=' + value[filterOptions[i].section[j].name] + '&'

					} else if(fieldType === 'text'){

						params +=  fieldName+'=' + value[filterOptions[i].section[j].name] + '&'

					} else if(fieldType === 'static-select'){

						params +=  fieldName+'=' + value[filterOptions[i].section[j].name].id + '&'

					} else {

						value[filterOptions[i].section[j].name].forEach(function(element, index) {

							let appendVal = element.api_end_point ? element.api_end_point : element.id;

							if(element.api_end_point){

								let paramArr = element.api_end_point.split('?');

								let queryArr = paramArr[paramArr.length - 1];

								params +=  queryArr + '&'
							} else {

								params +=  filterOptions[i].section[j].name+'[' + index + ']=' + element.id + '&'
							}
						});
					}
				}
			}
		}
	}
	return params
}

export const getFormattedFilterValues = (filterOptions,value) => {

	let params = {};

	for( var i in filterOptions){

		for(var j in filterOptions[i].section){

			if(value[filterOptions[i].section[j].name]){

				filterOptions[i].section[j].value = value[filterOptions[i].section[j].name];

				let fieldValue = value[filterOptions[i].section[j].name];

				let fieldName = filterOptions[i].section[j].name;

				let fieldType = filterOptions[i].section[j].type;

				if(filterOptions[i].section[j].isCustom) {

					params[fieldName] =  value[filterOptions[i].section[j].name].toString()

				} else {

					if(fieldType === 'date'){

						if(fieldValue.includes('last::') ){

							params[filterOptions[i].section[j].name] = fieldValue;

						} else {

							let value = 'date::' + fieldValue.map(date => moment(date).format('YYYY-MM-DD+HH:mm:ss')).join('~');

							params[filterOptions[i].section[j].name] = value;
						}
					} else if(fieldType === 'number'){

						params[fieldName+'_begin'] = value[filterOptions[i].section[j].name].min;
						params[fieldName+'_end'] = value[filterOptions[i].section[j].name].max;

					} else if(fieldType === 'text'){

						params[fieldName] = value[filterOptions[i].section[j].name];

					} else {

						params[filterOptions[i].section[j].name] = value[filterOptions[i].section[j].name].map(element=>element.id);
					}
				}
			}
		}
	}
	return params
}


export const MULTIPLE_PROPERTY_HELPER = {

	/**
	 * @param {String} string
	 * except(convertStringOfPropertiesToObject('a:=1;;b:=1;;')).tobe({ a: 1, b: 2})
	 */
	convertStringOfPropertiesToObject: (string) => {
		if (!string) return {};
		const obj = {};
		const splitByPart = string.split(';;');
		for (const info of splitByPart) {
			const splitByKeyValue = info.split(':=');
			obj[splitByKeyValue[0]] = splitByKeyValue[1]
		}
		return obj;
	},

	/**
	 * @param {Object} object
	 * except(convertObjectOfPropertiesToString({ a: 1, b: 2})).tobe('a:=1;;b:=1;;')
	 */
	convertObjectOfPropertiesToString: (object) => {
		if (!object) return '';
		let str = [];
		for (const key in object) {
			str.push(key + ':=' + object[key]);
		}
		return str.join(';;');
	}
}


/**
 * @param {Array} filterArray
 * 
 * Given a array of filter object, this function will return
 * 1. `formatedText` HTML block for the selected filterArray
 * 2. `apiParams` api parameters for applied filters
 */

export const getFormattedTextAndApiParamsForSelectedFilter = (filterArray) => {
	let formattedTextArray = []
	let apiParams = {}
		filterArray.forEach((element) => {
			const header = `<b>${element.label}: </b><em>`
			if (boolean(element.value) && Array.isArray(element.value)) {
				let valueArray = []
				element.value.forEach((val, index) => {
					apiParams[element.key + `[${index}]`] = val.id
					valueArray.push(val.name)
				})
				formattedTextArray.push(header + valueArray.join(', ') + '</em>')
			} else if (boolean(element.value)) {
				apiParams[element.key + '[0]'] = element.value.id
				formattedTextArray.push(header + element.value.name + '</em>')
			}
		})

	let formatedText = formattedTextArray.join(' | ')
	formatedText = formatedText ? '<em>Filter(s): </em>' + formatedText : ''

	return { formatedText, apiParams }
}
export const getBytesInBinary = (mb) => (2 ** 20) * mb

export const scrollToElement = (id,offset = 0)=>{

   $('html, body').animate({ scrollTop: $('#'+id).offset().top-200 }, 'slow');
}

export const isArchive = (path) => {
	let pathNameArray = path.split('/')
	return pathNameArray.includes('tickets-archive');
}

export const sessionItems =

	 {
		isRtlLayout : sessionStorage.getItem('is_rtl'),

		headerColor:  sessionStorage.getItem('header_color'),

		recaptchaSiteKey: sessionStorage.getItem('siteKey'),

		recaptchaVersion: sessionStorage.getItem('version'),

		recaptchaApplyfor: sessionStorage.getItem('applyfor'),

		isUserLoggedIn: sessionStorage.getItem('userLoggedIn'),

		loggedUserName: sessionStorage.getItem('full_name'),

		loggedUserMail: sessionStorage.getItem('logged_in_user_mail'),

		 loggedUserRole: sessionStorage.getItem('user_role'),

		 appVersion:  sessionStorage.getItem('app_version')
	}

export const parseUrlParams = () => {
	const search = location.search.substring(1);
	let urlParams = {};

	if (search.length !== 0) {
		try {
			urlParams = JSON.parse('{"' + decodeURIComponent(search)
				.replace(/"/g, '\\"')
				.replace(/&/g, '","')
				.replace(/=/g, '":"')
				.replace(/%2F/g, '\/') + '"}');
		} catch (error) {
			console.error('Error parsing URL parameters:', error);
		}
	}

	return urlParams;
};

export const fetchDataBasedOnUrl = (apiUrl,urlParams, axiosConfig, successCallback, errorCallback) => {

	axios.get(apiUrl, { params: urlParams }).then(res => {

		const transformedObject = {};

		res.data.data.forEach(item => {
			const { key, value_meta } = item;
			transformedObject[key] = value_meta;
		});

			successCallback(transformedObject);

	}).catch(error => {
		errorCallback(error);
	});
};
