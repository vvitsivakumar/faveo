<template>

	<div>

    	<CustomLoader v-if="submitFormInProgress"/>

		<Modal v-if="showModal" :showModal="showModal" :onClose="onClose" :containerStyle="{ width : '1200px', maxWidth: '1200px !important'}">

			<template #title>

				<h4 class="modal-title">{{ lang('edit_ticket') }}</h4>
			</template>

      		<template #fields>

				<Loader v-if="showLoader"/>

				<div id="ticket_modal_body">

					<Alert componentName="faveo-form"/>
					
					<div v-if="!showLoader" class="form_select">
						
						<DynamicSelect :label="trans('select_form')" :multiple="false" name="selectedForm"
			                apiEndpoint="/api/ticket/forms" :value="selectedForm" :showIcon="false"
			                :onChange="onChange" :clearable="false" :label-style="{ display : 'none' }">
						
						</DynamicSelect>
					</div>
					
					<template v-if="formUniqueKey && formSelected">
					<FormWithCaptcha :loading="!showLoader" btnClass='btn btn-primary pull-right' btnName="submit"
						componentName="faveo-form"
						btn_id="edit-ticket-submit" :formSubmit="formSubmit" page="ticket_edit_agent"
						recaptchaContainerClass="mt-2" :disableSubmit="submitFormInProgress">

						<template #fields>

							<ValidationObserver ref="faveoFormObserver" v-slot="{ values, errors, validate }">

								<FormRenderer
									category="ticket"
									:fetchFormFieldApi="fetchFormFieldApi"
									:scenario="scenario"
									:panel="panel"
									:isInlineForm="false"
									:formUniqueKey="formUniqueKey"
									:selectDependencyId="ticketId"
									selectDependencyKey="id"
								>
								</FormRenderer>
							</ValidationObserver>
						</template>
					</FormWithCaptcha>
					</template>
				</div>
			</template>

			<template #controls>

				<button v-if="!showLoader" type="button" class="btn btn-primary pull-right" :disabled="submitFormInProgress"
					@click="popUpSubmit()">

					<i class="fas fa-sync"></i> {{ trans('update') }}
				</button>
			</template>
		</Modal>
	</div>
</template>

<script>

import {faveoFormCommons} from "../../../../../../../mixins/faveoFormCommons";
import FormWithCaptcha from "../../../../../../Common/NewForm/FormWithCaptcha.vue";
import Modal from "../../../../../../Common/Modal.vue";
import CustomLoader from "../../../../../../MiniComponent/Loader.vue";
import Loader from "../../../../../../Extra/Loader.vue";
import Alert from "../../../../../../MiniComponent/Alert.vue";
import FormRenderer from "../../../../../../Common/NewForm/FormRenderer.vue";
import DynamicSelect from "../../../../../../MiniComponent/FormField/DynamicSelect.vue";

export default {
  name: 'edit-ticket-modal',
  description: 'Edit Ticket modal Component',

  props: {
    showModal: {type: Boolean, default: false},
    onClose: {type: Function},
    ticketId: {type: [String, Number], default: ''},
    reloadDetails : { type : Function},
	  selectedFormData: { type: Object, default : ()=> {}}
  },

  data() {
    return {
      formUniqueKey: '',
      submitFormInProgress: false,
      scenario: 'edit',
      panel: 'agent',
	    category:'ticket',
      selectedForm: this.selectedFormData,
      formSelected: true,
      fetchFormFieldApi : 'api/agent/edit-mode-ticket-details/' + this.ticketId
    }
  },
  mixins: [faveoFormCommons],
	
	created() {
		window.emitter.on('updateTicketCategory', this.updateTicketCategory)
	},

  methods: {
	  
	  updateTicketCategory() {
		  
		  window.emitter.emit('storeCategoryId', this.selectedForm.id)
	  },
	  
	  onChange (value, name) {
		  
		  this[name] = value;
		  
		  this.formSelected = false;
		  
		  this.updateFetchApi();
	  },
	  
	  updateFetchApi() {
		  
		  this.$store.dispatch('destroyFormInsatnce', this.formUniqueKey);
		  
		  this.$store.dispatch('unsetValidationError');
		  
		  this.fetchFormFieldApi = '/api/agent/edit-mode-ticket-details/' + this.ticketId + '?form_category_id=' + this.selectedForm.id
		  
		  setTimeout(()=>{
			  
			  this.$store.dispatch('createNewFormInstance', { formUniqueKey: this.formUniqueKey, scenario: this.scenario });
			  
			  this.formSelected = true;
		  },1)
	  },
    /**
     * it clicks the button, it clicks the button in FormWithCaptcha which in change triggers formSubmit.
     * Reason for this workaround is to hide the submit button coming from FormWithCaptcha without breaking
     * the functionality
     */
    popUpSubmit() {
      document.getElementById('edit-ticket-submit').click();
    },

    formSubmit(key, value) {
      this.$store.dispatch('setRecaptchaKey', value)
      this.onSubmit();
    },

    afterSubmit(data) {
      window.emitter.emit('reset-captcha');
      setTimeout(() => {
        window.emitter.emit('refreshTableAndData', true);
        this.reloadDetails('edit');
        this.onClose();
      }, 1000);
    },
  },

  beforeDestroy() {
    this.$store.dispatch('unsetAlert');
  },

  components: {
	  DynamicSelect,
	  Alert,
	  Modal,
	  CustomLoader,
	  Loader,
	  FormWithCaptcha,
	  FormRenderer
  }
};
</script>

<style scoped>
#ticket_modal_body {
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
}

.form_select {
	margin-left: 1em;
	margin-right: 1em;
}
</style>

<style>

#edit-ticket-submit{
  /*for hiding submit button of FormWithCaptcha component*/
  display: none;
}

/*.modal-mask { z-index: 9999 !important;}*/
</style>