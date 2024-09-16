<template>

	<div>

		<TimePeriod v-if="scenario === 'recur'" :recur_mode="recur_mode"></TimePeriod>

		<TicketTemplateName v-if="scenario === 'template'" :template_mode="template_mode"></TicketTemplateName>

		<div class="row">

			<div v-for="formSection in formSections" :key="formSection.id" :id="formSection.id" class="col-md-12">

				<FormSectionRenderer :formSection="formSection"
					:formId="formId"
					:formUniqueKey="formUniqueKey"
					:panel="panel"
					:scenario="scenario"
					:formType="category"
					:btn-style="btnStyle"
					:input-style="inputStyle"
					:isInlineForm="isInlineForm"
					:sizeModules="sizeModules"
					:apiKey="apiKey"
					:selectDependencyId="selectDependencyId"
					:selectDependencyKey="selectDependencyKey"
				 	:recur_mode="recur_mode"
				>
				</FormSectionRenderer>
			</div>
		</div>
	</div>
</template>

<script>

	import FormFieldRenderer from "./FormFieldRenderer.vue";
	import Loader from "../../MiniComponent/Loader.vue";
	import TimePeriod from "../../Admin/Recurring/TimePeriod.vue";
	import TicketTemplateName from "../../Admin/Tickets/Templates/TicketTemplateName.vue";
	import {errorHandler} from "../../../helpers/responseHandler";
	import {mapActions, mapGetters, mapState} from "vuex";
	import FormSectionRenderer from "./FormSectionRenderer.vue";
	import _ from "lodash-core";
	import {boolean, MULTIPLE_PROPERTY_HELPER} from "../../../helpers/extraLogics";

	export default {

		name: 'form-renderer',

		/**
		 * Props passed to the component:
		 * - recur_mode: Specifies the mode for recurring events. Default is an empty string.
		 * - template_mode: Specifies the mode for templates. Default is an empty string.
		 * - fetchFormFieldApi: The API endpoint to fetch form field data. Required.
		 * - formUniqueKey: The unique key for identifying the form instance. Required.
		 * - category: The category of the form. Required.
		 * - scenario: The scenario in which the form is being used. Required.
		 * - panel: The panel where the form is displayed. Required.
		 * - isChildForm: Boolean indicating if the form is a child form. Default is false.
		 * - disableEmail: Boolean indicating if email fields are disabled. Default is false.
		 * - inputStyle: Custom input styles for the form. Default is an empty object.
		 * - btnStyle: Custom button styles for the form. Default is an empty object.
		 * - isInlineForm: Boolean indicating if the form is inline. Default is true.
		 * - formId: The ID of the form. Default is an empty string.
		 * - apiKey: The API key for fetching data. Default is an empty string.
		 * - selectDependencyId: The ID of the select dependency. Default is an empty string.
		 * - selectDependencyKey: The key of the select dependency. Default is an empty string.
		 */
		props: {
			recur_mode: {type: String, default: ''},
			template_mode: {type: String, default: ''},
			fetchFormFieldApi: {type: String, required: true},
			formUniqueKey: {type: String, required: true},
			category: {type: String, required: true},
			scenario: {type: String, required: true},
			panel: {type: String, required: true},
			isChildForm: {type: Boolean, default: false},
			disableEmail: {type: Boolean, default: false},
			inputStyle: { type: Object, default: () => {}},
			btnStyle: { type: Object, default: () => {}},
			isInlineForm: { type: Boolean, default: true },
			formId: { type: String, default: '' },
			apiKey : { type : String, default : '' },
			selectDependencyId : { type : [String, Number], default : '' },
			selectDependencyKey : { type : String, default : '' },
			callingFrom: { type : String, default : ''}
		},

		/**
		 * Data properties for the component:
		 * - formSections: An array to store form sections. Default is an empty array.
		 * - sizeModules: Specifies the size modules for the form. Default is an empty string.
		 */
		data: () => {
			return {
				formSections: [],
				sizeModules: ''
			}
		},

		computed: {

			/**
			 * Maps the 'setAttachmentsData' action.
			 */
			...mapActions(['setAttachmentsData']),

			/**
			 * Maps the 'getCategory' getter.
			 */
			...mapGetters(['getCategory']),

			/**
			 * Computes and returns an object containing API parameters including category, scenario, panel, and api_key.
			 */
			getApiParams() {

				return {category: this.category, scenario: this.scenario, panel: this.panel, api_key : this.apiKey}
			}
		},

		/**
		 * Executes logic upon component creation.
		 * - Retrieves form sections based on the category.
		 * - Listens for 'updateTicketCategory' event to update form sections.
		 * - Listens for 'modelFormFieldFetched' event to update form sections based on fetched model form fields.
		 */
		created() {

			this.getFormSections(this.getCategory);
			
			window.emitter.on('modelFormFieldFetched', (value)=>{

				this.formSections = this.formSections.filter(item => {

					if ('node_identifier' in item) {

						return item.node_identifier !== value.identifier;
					}

					return true;
				});

				this.formSections =  [...this.formSections, ...value.nodes];
			});
			
			window.emitter.on('disableSpecificFormField', (value)=>{
				
				this.disableAt(this.formSections, value.identifier, value.disabled, value.setValue);
			});
		},

		/**
		 * Watches for changes in the 'getCategory' computed property.
		 * - Calls 'getFormSections' method with the new category value.
		 */
		watch: {

			getCategory(newCategory) {

				this.getFormSections(newCategory);
			},
		},

		methods: {

			/**
			 * Fetches form sections based on the provided category.
			 * @param {String} category - The category for which form sections need to be fetched.
			 */
			getFormSections(category = null) {
				
				let params = this.getApiParams;

				if(category) {

					params.category = category;

					this.formSections=[]
				}

				if (this.isChildForm) {

					this.$store.dispatch('startChildFormLoader');

				} else {

					this.$store.dispatch('startLoader', 'getFormSections');
				}

				axios.get(this.fetchFormFieldApi, {params:params}).then(response => {

					this.formSections = response.data.data.form_sections;

					this.sizeModules = response.data.data;

					let attachmentsResponse = response.data.data.attachments;

					this.$store.dispatch('setAttachmentsData', attachmentsResponse);
					
					if(this.scenario !== 'recur' && this.scenario !== 'template'){
						
						this.formSections[0].form_fields.first[0]['auto_focus'] = true;
					}
					
					window.emitter.emit('storeCategoryId', response.data.data.form_category_id ? response.data.data.form_category_id : response.data.data.id)

					window.emitter.emit('updateOrgUserFormOrg', response.data.data.selectedorg ? response.data.data.selectedorg : '')
					
					if((this.scenario === 'recur' && this.recur_mode === 'edit' && response.data.data.form) || (this.scenario === 'template' && this.template_mode === 'edit' && response.data.data.form)) {

						window.emitter.emit('updateSelectedForm',response.data.data.form);
					}
					
					if (this.disableEmail) {

						this.disableAt(this.formSections, "email");
					}

					this.$store.dispatch('updateSubmitApiEndpoint', {
						formUniqueKey: this.formUniqueKey,
						submitApiEndpoint: response.data.data.submit_endpoint
					});

					if(this.callingFrom !== 'popup') {
						
						const recurData = response.data.data.recur ?? { id: null, name: '', interval: '', delivery_on: '', start_date: '', end_date: '', execution_time: ''} ;
						
						if (recurData) {
							
							this.$store.dispatch('setEditorAttachments', response.data.data.attachments ?? [])
							
							for (const [key, value] of Object.entries(recurData)) {
								
								this.$store.dispatch('updateRecurProperties', {key: key, value: value});
							}
						}
						
						const templateData = response.data.data.template ?? { id: null, name: '' };
						
						if (templateData) {
							
							for (const [key, value] of Object.entries(templateData)) {
								
								this.$store.dispatch('updateTemplateProperties', {key: key, value: value});
							}
						}
						
						this.$store.dispatch('setBatchTicketMode', response.data.data.batch_ticket_status);
					}
				}).catch(err => {

					errorHandler(err, 'form-renderer');

				}).finally(() => {

					if (this.isChildForm) {

						this.$store.dispatch('stopChildFormLoader');

					} else {

						this.$store.dispatch('stopLoader', 'getFormSections');
					}
				})
			},

			/**
			 * Disables form fields with the specified form identifier in the provided array.
			 * @param {Array} array - The array of form fields.
			 * @param {String} form_identifier - The form identifier to be disabled.
			 */
			disableAt(array, form_identifier, disabledVal = true, setValue = false){
				
				let idx = _.findIndex(array, (element) => element.key === form_identifier);

				if(idx !== -1) {

					array[idx].disabled = disabledVal;
					
					if(!setValue) {
						
						window.emitter.emit('updateSpecificFormField',{name : form_identifier, value: array[idx].value });
					
					} else {
						
						let apiUrl = MULTIPLE_PROPERTY_HELPER.convertStringOfPropertiesToObject(array[idx].api_info).url;
						
						axios.get(apiUrl).then(response => {
							
							let data = response.data.data.data;
							
							let value = data.find(item => item.name === 'Draft');
							
							window.emitter.emit('updateSpecificFormField',{name : form_identifier, value: value });
							
						}).catch(err => {
							
							errorHandler(err, 'form-renderer');
						})
					}

				} else {

					for (let i = 0; i < array.length; i++) {

						if (array[i].form_fields && typeof array[i].form_fields === 'object') {

							Object.keys(array[i].form_fields).forEach(key => {

								this.disableAt(array[i].form_fields[key],form_identifier, disabledVal, setValue)
							});

						} else {

							if(boolean(array[i].options)) {

								array[i].options.forEach(element => {

									this.disableAt(element.nodes,form_identifier, disabledVal, setValue)
								})
							}
						}
					}
				}
			}
		},

		components: {
			FormSectionRenderer,
			FormFieldRenderer,
			Loader,
			TimePeriod,
			TicketTemplateName,
		}
	}
</script>

<style scoped>

</style>