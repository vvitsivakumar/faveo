import { mapGetters } from 'vuex';
import axios from 'axios';

import { validateFormData, getFormUniqueKey, convertMapToSubmitableData } from '../helpers/formUtils';
import { errorHandler, successHandler } from '../helpers/responseHandler';
import moment from "moment";

export const faveoFormCommons = {

    beforeMount() {
      // beforemounting the component we will create a new instance for the FaveoForm
        this.formUniqueKey = getFormUniqueKey(this.category);
        this.$store.dispatch('createNewFormInstance', { formUniqueKey: this.formUniqueKey, scenario: this.scenario || this.mode });
    },

    computed: {
        ...mapGetters({
            getFaveoFormData: 'getFaveoFormData',
            getRecurAdditionalInfo: 'getRecurAdditionalInfo',
            getTemplateAdditionalInfo: 'getTemplateAdditionalInfo',
            showLoader: 'showLoader',
            getEditorAttachments: 'getEditorAttachments',
            getRecaptchaKey: 'getRecaptchaKey',
            isChildFormLoading: 'getChildFormLoading',
            getStoredTicketId : 'getStoredTicketId',
            getSelectedOrgRelatedDept : 'getSelectedOrgRelatedDept',
            getSource: 'getSource',
            getApiKey: 'getApiKey',
            getFormAdditionalInfo: 'getFormAdditionalInfo',
        }),
    },

    created() {
        window.emitter.on('storeCategoryId', (categoryId) => {
            this.formCategoryId = categoryId
        })
    },

    methods: {

      // triggered when submit button got a click
        async onSubmit(additionalParams = null) {
            const isValid = await validateFormData(this.$refs.faveoFormObserver);

            if (isValid) {
        // if form is valid submit form data to the server
                this.submitFormToServer(additionalParams);
            }
        },

        submitFormToServer(additionalParams = null) {

            this.$store.dispatch('unsetValidationError');

            this.submitFormInProgress = true;

          // get formValues and submitApiEndpoint from store
            const { submitApiEndpoint, formDataMap } = this.getFaveoFormData[this.formUniqueKey];

          // create new instance of FormData
            let _formData = new FormData();

          // append panel to the the formData
            _formData.append('panel', this.panel);

            _formData.append('form_category_id', this.formCategoryId);

            // if (this.panel === 'client') {
            //     _formData.append('category_id', this.formCategoryId);
            // }

            _formData.append('g-recaptcha-response', this.getRecaptchaKey);

            if(this.getSource) {

                _formData.append('source_id', this.getSource);
            }

            if(this.getApiKey) {

                _formData.append('api_key', this.getApiKey);
            }

            if (this.getEditorAttachments.length) {

                if(this.scenario === 'recur') {

                    _formData.append('attachments', JSON.stringify(this.getEditorAttachments.filter((obj) => !obj.id )))

                } else {

                    _formData.append('attachments', JSON.stringify(this.getEditorAttachments))
                }
            }

          // iterate over the formValues and append each value to the formData instance
            const formValueObj = convertMapToSubmitableData(formDataMap);

            for (const [key, value] of Object.entries(formValueObj)) {
                _formData.append(key, value);
            }

            // appending additional params too to the api call
            additionalParams && Object.keys(additionalParams).forEach(key => {
                _formData.append(key, additionalParams[key]);
            });


            // incase of recur, iterate over the recur object(get it form store) and append each value to the formData instance
        if (this.scenario === 'recur') {

            for (const [key, value] of Object.entries(this.getRecurAdditionalInfo)) {

                if (key === 'attach' && Array.isArray(value) && value.length) {

                    const editAttachs = this.getEditorAttachments.map(obj => obj.id);

                    const storeAttachs = value.filter(obj => editAttachs.includes(obj.id));

                    storeAttachs.forEach((item, index) => {

                        _formData.append(`recur[attachment_ids][${index}]`, item.id);
                    })

                } else {
                    _formData.append('recur[' + key + ']', value);
                }
            }
        }

            if (this.scenario === 'template') {
                _formData.append('id', this.getTemplateAdditionalInfo.id);
                _formData.append('name', this.getTemplateAdditionalInfo.name);
            }

        if(this.page && this.page === 'add_ticket_with_form') {

            _formData.append('ticket_id', this.getStoredTicketId);
        }

        if(this.page && this.page === 'add_id_with_form') {

            _formData.append('problem_id', this.form_id);
        }
        if(this.page || (this.panel === 'client' && this.category === 'requester') ) {

            if(this.page === 'requester_create_agent' || this.page === 'requester_edit_agent' || (this.panel === 'client' && this.category === 'requester') ) {

                if(this.getSelectedOrgRelatedDept) {

                    this.getSelectedOrgRelatedDept.forEach((obj,index)=>{

                        _formData.append('related['+index+']', JSON.stringify({org_dept: obj.id, org_id:obj.org_id}));
                    });
                }
            }
        }

        if(this.getFormAdditionalInfo) {

            Object.entries(this.getFormAdditionalInfo).forEach(([key, value]) => {

                _formData.append(key, value);
            });
        }

          // Set HTTP header to post a multipart/form-data
            let headers = { 'Content-Type': 'multipart/form-data' };

            axios.post(submitApiEndpoint, _formData, { headers })
            .then(response => {

                if(this.panel === 'client' && this.category === 'ticket' && this.formId === 'chat-widget') {

                    response.data.message = "Ticket created successfully";

                    successHandler(response, 'faveo-form');

                    this.afterSubmit(response);

                    return
                }
                successHandler(response, 'faveo-form');

              // Call afterSubmit function to perform postSubmit operations
                this.afterSubmit(response);
            })
        .catch(error => {
        
            errorHandler(error, 'faveo-form');

            if(error.response.status === 400) {

                // Call afterError function to close Modal
                this.afterError();
            }
        })
        .finally(() => {
            this.submitFormInProgress = false;
            })
        },
    },

    beforeDestroy() {

      // destroy the form instance before killing the component
        this.$store.dispatch('destroyFormInsatnce', this.formUniqueKey)
    },
}