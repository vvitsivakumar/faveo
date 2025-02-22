<template>
  <form-field-template  :classname="classname" :label="lang(labelName)" :name="name">
		<div class="intl-tel-input allow-dropdown separate-dial-code iti-sdc-3" style="width: 100%">
			<input class="form-control" :class="{mob_align : language === 'ar'}"
       type="text"
       :placeholder="example"
       v-model="changedValue"
       v-on:input="onChange(changedValue, name)"
       @keypress="isNumber"
       :maxlength="getMaxLength(example)"
       :style="inputStyle"
       id="id"/>

			<div @click="toggleList" :class="{tel: lang_locale == 'ar'}" class="flag-container" style="width: 5pc">
				<div class="selected-flag" tabindex="0" >
					<div id="flag" :class="getClassByISO(iso)">
					</div>
					<div :class="{code: lang_locale == 'ar'}" class="selected-dial-code"> {{phone_code}}
					</div>
					<div :class="{arrow: lang_locale == 'ar'}" class="iti-arrow">
					</div>
				</div>
				<ul
					v-bind:class="{coun_list: lang_locale == 'ar'}"
					v-if="showList"
					class="country-list">
					<li
						v-for="code in country_codes.slice(224,226)"
						class="country preferred"
						@click="selectCountry(code)">
						<div
							v-bind:class="{flag: lang_locale == 'ar'}"
							class="flag-box">
							<div
								:class="getClassByISO(code.iso)">
							</div>
						</div>
						<span
							v-bind:class="{coun_name: lang_locale == 'ar'}"
							class="country-name">{{code.name}}
						</span>
						<span
							v-bind:class="{country: lang_locale == 'ar'}"
							class="dial-code">+{{code.phonecode}}
						</span>
					</li>
					<li class="divider"></li>
					<!-- in dropdown -->
					<li
						v-for="country_code in country_codes"
						class="country preferred"
						@click="selectCountry(country_code)">
						<div
							v-bind:class="{flag: lang_locale == 'ar'}"
							class="flag-box">
							<div
								:class="getClassByISO(country_code.iso)">
							</div>
						</div>
						<span
							v-bind:class="{coun_name: lang_locale == 'ar'}"
							class="country-name">{{country_code.name}}
						</span>
						<span
							v-bind:class="{country: lang_locale == 'ar'}"
							class="dial-code">+{{country_code.phonecode}}
						</span>
					</li>
				</ul>
			</div>
	</div>
	</form-field-template>
</template>

<script>
import { findObjectByKey } from '../../../helpers/extraLogics';
import axios from "axios";
import {errorHandler} from "../../../helpers/responseHandler";
import {flatten, getCountry} from "../../../helpers/extraLogics";
import FormFieldTemplate from "./FormFieldTemplate.vue";

export default {

	name: "phone-n-country-code",
	description: "",

	components:{
    'form-field-template' : FormFieldTemplate,
    },

	props:{

    labelName : { type : String, default : 'mobile_number'},

		language : { type : String, default : ''},
	    /**
         * classname of the form field. It can be used to give this component any bootstrap class or a custom class
         * whose css will be defined in parent class
         * @type {String}
         */
        classname : {type: String, default:''},

        value: { type: [String,null], required: true },

        /**
         * the name of the state in parent class
         * @type {String}
         */
        name : {type: String, Required:true},

        /**
	     * The function which will be called as soon as value of the field changes
	     * It should have two arguments `value` and `name`
	     *     `value` will be the updated value of the field
	     *     `name` will be thw name of the state in the parent class
	     *
	     * An example function :
	     *         onChange(value, name){
	     *             this[name]= selectedValue
	     *         }
	     *
	     * @type {Function}
	     */
	    onChange: { type: Function, Required: true },

	    countryCode: {type: [Number, null], Required: true},

	    countryIso: {type: String, default : ''},

	    inputStyle : { type : Object, default : ()=>{}},

      apiUrl : { type : String, default : "/api/dependency/country-codes" }

		},

	data() {
		return {
			country_codes: [],// for country codes array
			phone_code: this.countryCode,// phone code of the user
			showList: false,// showing country code dropdown if showList is true
			country: {},// getting country object with iso and flag by using user phonecode 
			iso: this.countryIso,// country iso
			example: '99876 54321',// phone number example of the country
			lang_locale: '',// locale of the user
			contryData: null,
			changedValue: this.value
		}
	},

	watch: {
	    value(newVal) {
	      this.changedValue = newVal;
	    }
  	},

	beforeMount() {
		if (!this.countryCode && !this.countryIso) {
			getCountry()
				.then((res) => {
					this.iso = res;
					this.getCountryCodes();
				})
				.catch((error) => {
					console.warn(error);
					this.iso = 'in';
					this.phone_code = 91;
					this.getCountryCodes();
				})
    	} else {
    		this.getCountryCodes();
    	}
		this.changedValue = this.value;
	},

	created() {
		// getting locale from localStorage
		this.lang_locale = localStorage.getItem('LANGUAGE');
	},
	methods: {

		/* getting country code details from vuex store
		* @param  {Array} codes - array of country details with iso phonecode and example phone number from vuex store
		* @return {Void}
		*/
		countryDetails(codes) {
			this.country_codes = codes;
			if (this.countryIso) { // If parent component has countryCode
				this.country = findObjectByKey(codes, 'iso',this.iso);
			} else if(this.countryCode) {
				this.country = findObjectByKey(codes, 'phonecode',this.phone_code)
			} else { // If parent component doesn't has countryCode, populate by client IP location
				this.country = findObjectByKey(codes, 'iso', this.iso.toUpperCase());
			}
			this.selectCountry(this.country, false);
		},

		/**
		 * checking the values entered in the input field
		 * @param  {Event}
		 * @return {Boolean} returns true if values entered in input field only numbers
		 */
		isNumber(evt) {
			evt = (evt) ? evt : window.event;
			var charCode = (evt.which) ? evt.which : evt.keyCode;
			if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
				evt.preventDefault();;
			} else {
				return true;
			}
		},
		/**
		 * toggle showList variable
		 */
		toggleList() {
			this.showList = !this.showList;
		},

		getMaxLength(value) {
			
			const str = '' + value;
			
			return str.replace(/\s/g, '').length;
		},

		getClassByISO(iso) {
			
			if(iso) {
				
				return 'iti-flag '+ iso.toLowerCase();
			}
		},

		/**
		 * Changing the country region that user wants
		 * @param  {Object} country is an object with iso and phonecode and example
		 * @return {Void}
		 */
		selectCountry(country, isFromTemplate = true){
			this.iso = country.iso;
			this.phone_code = country.phonecode;
			this.example  = country.example;
			this.$emit('countCode',this.phone_code);
			this.$emit('countIso',this.iso);
			if (isFromTemplate) {
				this.changedValue = '';
			}
		},

		getCountryCodes() {
			axios
          .get(this.apiUrl, {
		        params: {
							meta: true,
							limit: 'all'
		        }
		      })
		      .then(res => {
		      	this.contryData = flatten(res.data.data);
		        this.countryDetails(this.contryData);
		      })
		      .catch(err => {
		        errorHandler(err, "contryCode");
		      });
		}
  }
};
</script>

<style scoped> 
	
	.mob_align{
		padding-left: 0px !important;
		padding-right: 84px !important;
	}
</style>