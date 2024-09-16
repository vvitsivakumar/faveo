<template>

	<form-field-template :label="label" :labelStyle="labelStyle" :name="name" :classname="classname" :hint="hint" :required="required"
                     :isInlineForm="isInlineForm" :tipRule="tipRule" :labelLength="labelLength">
	
		<ValidationProvider :name="name" :rules="rules" v-model="changedValue">
			
			<template v-slot="{ field, errorMessage, meta, classes }">
				
				<div class="row">
					
					<div :class="extensionEnabled && fieldFor !== 'automator' ? 'col-sm-8' : 'col-sm-12'">
						
						<div class="intl-tel-input allow-dropdown separate-dial-code iti-sdc-3" style="width: 100%">
							
							<input class="form-control" autocomplete="off"
							       :id="id"
							       :name="name"
							       :class="['form-control', inputClass, classes, errorMessage ? 'field-danger' : '']"
							       type="text"
							       :disabled="disabled"
							       :style="inputStyle"
							       v-model="changedValue"
							       v-on:input="onInputChange(changedValue, name)"
							       @keyup="keyupListener($event,name)"
							       @keydown="keydownListener($event,name)"
							       @keypress="keypressEvt($event,name,type)"
							       @paste="pasteEvt($event,name,type)"
							       :placeholder="trans(placehold)"
							       :maxlength="getMaxLength(example)"
							       :pattern="pattern ? pattern : null"
							       :ref="autofocus ? 'mobileField' : ''"/>
							
							<div @click="toggleList" class="flag-container" style="width: 5pc" v-click-outside="onClickOutside">
								
								<div class="selected-flag" tabindex="0" >
									
									<div id="flag" :class="getClassByISO(iso)"></div>
									
									<div class="selected-dial-code"> {{phone_code}}</div>
									
									<div class="iti-arrow"></div>
								</div>
								
								<ul v-if="showList" class="country-list">
									
									<li v-for="code in country_codes.slice(224,226)" class="country preferred"
									    @click="selectCountry(code)">
										
										<div class="flag-box">
											
											<div :class="getClassByISO(code.iso)"></div>
										</div>
										
										<span class="country-name">{{code.name}}</span>
										
										<span class="dial-code">+{{code.phonecode}}</span>
									</li>
									
									<li class="divider"></li>
									
									<li v-for="country_code in country_codes" class="country preferred"
									    @click="selectCountry(country_code)">
										
										<div class="flag-box">
											
											<div :class="getClassByISO(country_code.iso)"></div>
										</div>
										
										<span class="country-name">{{country_code.name}}</span>
										
										<span class="dial-code">+{{country_code.phonecode}}</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
					
					<div v-if="extensionEnabled && fieldFor !== 'automator'"  class="col-sm-4">
						
						<input class="form-control" autocomplete="off"
						       type="text"
						       :id="ext[0].id"
						       :name="ext[0].key"
						       v-model="changedExtValue"
						       v-on:input="onExtInputChange(changedExtValue, ext[0].key)"
						       @keyup="keyupListener($event,ext[0].key)"
						       @keydown="keydownListener($event,ext[0].key)"
						       @keypress="keypressEvt($event,ext[0].key,'number')"
						       @paste="pasteEvt($event,ext[0].key,'number')"
						       :maxlength="8"
						       placeholder="EXT">
					</div>
					
					<span v-if="errorMessage" class="error-block is-danger col-sm-12">{{errorMessage}}
						<span v-if="!pattern">{{validationMessage ? '(' + validationMessage + ')' : ''}} </span>
					</span>
				</div>
			</template>
		</ValidationProvider>
	</form-field-template>

</template>

<script type="text/javascript">

import FormFieldTemplate from "../../MiniComponent/FormField/FormFieldTemplate.vue";
import {findObjectByKey, flatten, getCountry} from "../../../helpers/extraLogics";
import axios from "axios";
import {errorHandler} from "../../../helpers/responseHandler";

export default {
	name: "mobile-field",
	
	description: "mobile field component along with ext block",
	
	props: {
		
		label: { type: String, required: true },
		
		hint: { type: String, default: "" }, //for tooltip message
		
		value: { type: [String,null], required: true },
		
		name: { type: String, required: true },
		
		type: { type: String, default: "text" },
		
		onChange: { type: Function, Required: true },
		
		classname: { type: String, default: "" },
		
		required: { type: Boolean, default: false },
		
		keyupListener: { type: Function , default : ()=>{} },
		
		keydownListener: { type: Function , default : ()=>{} },
		
		keypressEvt: { type: Function ,  default : ()=>{} },
		
		pasteEvt: { type: Function ,  default : ()=>{} },
		
		labelStyle:{type:Object},
		
		placehold : { type: String, default : 'enter_a_value'},
		
		id : {type: [String,Number], default:'mobile-field'},
		
		disabled : { type : Boolean, default : false},
		
		inputStyle : { type : Object, default : ()=>{}},
		
		max : { type : [Number, String] , default : ''},
		
		inputClass : { type : String, default : ''},
		
		isInlineForm: { type: Boolean, default: false },
		
		rules: { type: String, default: '' },
		
		pattern: { type: String, default: null },
		
		validationMessage: { type: String, default: '' },
		
		from : { type : String, default : '' },
		
		tipRule : { type : [Number, Boolean], default : false },
		
		autofocus : { type : [Number, Boolean], default : false },
		
		countryCode: {type: [Number, null], Required: true},
		
		extensionEnabled: { type : [Number, Boolean], default : false },
		
		ext: { type: Array, default : () => [] },
		
		onExtChange: { type: Function, default : ()=>{} },
		
		extValue: { type: String, default: "" },
		
		labelLength : { type : [Number, String], default : 500 },
		
		apiKey: { type: String, default: '' },
		
		fieldFor: { type: String, default: '' }
	},
	
	data() {
	
		return {
			
			country_codes: [],
			
			phone_code: this.countryCode,
			
			showList: false,
			
			country: {},
			
			iso: 'in',
			
			contryData: null,
	
			changedValue: this.value,
			
			example: '99876 54321',
			
			changedExtValue : this.extValue
		};
	},
	
	mounted() {
		
		this.changedValue = this.value;
		
		this.changedExtValue = this.extValue;
		
		this.$nextTick(() => {
			
			if(this.autofocus){
				
				setTimeout(()=>{
					
					this.$refs.mobileField.focus();
				},1);
			}
		});
	},
	
	watch: {
		
		value(newVal) {
		
			this.changedValue = (this.id === 'seats' && newVal <= 0 && newVal !== '') ? 0 : newVal;
		},
		
		extValue(newVal) {
		
			this.changedExtValue = newVal;
		},
		
		countryCode(newValue,oldValue) {
			
			this.phone_code = newValue;
		}
	},
	
	beforeMount() {
		
		if (!this.countryCode) {
			
			getCountry().then((res) => {
				
				this.iso = res;
				
				this.getCountryCodes();
				
			}).catch((error) => {
				
				console.warn(error);
			
				this.iso = 'in';
			
				this.phone_code = 91;
			
				this.getCountryCodes();
			})
		} else {
			
			this.getCountryCodes();
		}
		
		this.changedValue = this.value;
		
		this.changedExtValue = this.extValue;
	},
	
	methods: {
		
		onClickOutside() {
			
			this.showList = false;
		},
		
		onInputChange(value, name) {
			
			value = value.replace(/[^0-9]/g, '');
			
			this.changedValue = value;
			
			if(this.fieldFor === 'automator' && this.extensionEnabled) {
				
				let dataVal = {
					value : this.changedValue,
					nodes : this.ext
				}
				this.onChange(dataVal, name);
				
			} else {
				
				this.onChange(this.changedValue, name);
			}
		},
		
		onExtInputChange(value, name) {
			
			value = value.replace(/[^0-9]/g, '');
			
			this.changedExtValue = value;
			
			this.onExtChange(this.changedExtValue, name);
		},
		
		countryDetails(codes) {
			
			this.country_codes = codes;
			
			if(this.countryCode) {
				
				this.country = findObjectByKey(codes, 'phonecode',this.phone_code)
				
			}  else {
			
				this.country = findObjectByKey(codes, 'iso', this.iso.toUpperCase());
			}
			
			this.selectCountry(this.country, false);
		},
		
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
		
		selectCountry(country){
			
			this.iso = country.iso;
			
			this.phone_code = country.phonecode;
			
			this.example  = country.example;
			
			this.$emit('countryCode',this.phone_code);
			
			if(this.fieldFor !== 'automator') {
				this.onChange(this.changedValue, this.name)
			}
		},
		
		getCountryCodes() {
			
			axios.get('/api/dependency/country-codes?time='+Date.now(), {params: { meta: true, limit: 'all', 'api_key' : this.apiKey }}).then(res => {
				
				this.contryData = flatten(res.data.data);
				
				this.countryDetails(this.contryData);
			
			}).catch(err => {
			
				errorHandler(err, "contryCode");
			});
		}
	},
	
	components: {
		"form-field-template": FormFieldTemplate,
	}
};
</script>
