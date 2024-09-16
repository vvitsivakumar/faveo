<template>

    <modal :showModal="true" :onClose="onClose">

      <template #title>
        <h4 class="modal-title">{{lang(title)}}</h4>
      </template>

      <template #alert>

        <alert componentName="save-report-modal"/>
      </template>

		<template #fields>

			<div v-if="isLoading">

				<custom-loader></custom-loader>
			</div>

			<div class="save-report" v-focus-first-input>
				<text-field
					id="name"
					:label="lang('name')"
					type="text"
					name="name"
					classname="col-md-12"
					:value="name"
					:onChange="onPropertyChange"
          :placehold="lang('enter_a_value')"
					:required="true">
				</text-field>

				<text-field
					id="description"
					:label="lang('description')"
					type="textarea"
					name="description"
					classname="col-md-12"
					:value="description"
					:onChange="onPropertyChange"
          :placehold="lang('enter_a_value')"
					:required="true"
          :show-word-limit="true"
          length="180">
				</text-field>

				<checkbox
					name="isPublic"
					:value="isPublic"
					:label="lang('make_this_report_public')"
					:onChange="onPropertyChange"
					classname="col-md-12"
					id="allow-only-ldap-login">
				</checkbox>
			</div>
		</template>

      <template #controls>
        <button class="btn btn-primary" id="new-report-submit" @click="onSubmit" :disabled="isLoading">
          <span><i :class="modalMode === 'fork' ? 'fas fa-save' : 'fas fa-sync-alt'"></i></span>
          {{ trans(modalMode === 'fork' ? 'save' : 'update') }}
        </button>
      </template>

    </modal>
</template>

<script>
import axios from 'axios';
import {errorHandler,successHandler} from "../../../../../resources/assets/js/helpers/responseHandler";
import {boolean, getFormattedFilterValues, getIdFromUrl} from "../../../../../resources/assets/js/helpers/extraLogics";
import TextField from "../../../../../resources/assets/js/components/MiniComponent/FormField/TextField.vue";
import Checkbox from "../../../../../resources/assets/js/components/MiniComponent/FormField/Checkbox.vue";

export default {

    name:'save-report-modal',

    props: {

      // fork(new report) or update existing one
      modalMode: {
        type: String,
        required: true
      },

      // report data oject need to be saved
      reportDataObj: {
        type: Object,
        required: true
      },

      // on clodse modal fn
      onClose: {
        type: Function,
        required: true
      },

      from: {
        type: String,
        default: ''
      },

      filterValues:{
        type: Object,
        default: () => {}
      },

      filterArray : { type : Array, default : ()=>[] },

      chartType: {type: String, default: ''}
    },

    data() {
      return {
        title: '', // modal heading
        name: '', // report name
        description: '', // report description
        isPublic: true, // is public/private report
        isLoading: false
      }
    },

    beforeMount() {
      this.setUpComponentPropertiesBasisOfMode();
    },

    methods: {

      setUpComponentPropertiesBasisOfMode() {
        if(this.modalMode === 'fork') {
          this.title = 'fork_this_report';
        } else if(this.modalMode === 'update') {
          this.name = this.reportDataObj.name;
          this.description = this.reportDataObj.description;
          this.isPublic = this.reportDataObj.is_public;
          this.title = 'update_this_report';
        }
      },

      onSubmit() {
        this.isLoading = true;

        // if creating,
        let postConfigUrl

        postConfigUrl = this.from === 'sd_report' || this.from === 'sd_report_home' ? 'service-desk/api/fork/sd-report' : 'api/agent/report-config';

        if(this.modalMode === 'fork'){
          // if forking, we need parent id
          postConfigUrl = this.from === 'sd_report' || this.from === 'sd_report_home' ? postConfigUrl : postConfigUrl + "/" + getIdFromUrl(window.location.pathname);
        }

        axios.post(postConfigUrl, this.from === 'sd_report' || this.from === 'sd_report_home' ? this.getSdReportParams() : this.getSaveReportParams())
        .then(res => {
          setTimeout(() => this.onClose(), 1000); // close the modal after 1 second
          successHandler(res, 'save-report-modal');
          if(this.modalMode === 'fork') { // redirect to report list page only if the case of `fork`
            this.redirectToReporListPage();
          } else { // refresh the entry page while update completion
            window.emitter.emit(this.from === 'sd_report' ? 'refreshSdReport' :
                this.from === 'report-list' || this.from === 'sd_report_home' ? 'refreshReportHomePage' :
                    'refreshReportEntryPage');
          }

          window.emitter.emit('updateAgentSidebar');
        }).catch(err => {
          errorHandler(err, 'save-report-modal');
        }).finally(res => {
          this.isLoading = false;
        });
      },

      /**
       * Get the parameters to be saved for the report
       */
      getSaveReportParams() {
        const clonedReportDataObj = JSON.parse(JSON.stringify(this.reportDataObj));
        if(this.modalMode === 'fork') { // assign null to report id to create a fresh new report
          clonedReportDataObj.id = null;
        }
        clonedReportDataObj.name = this.name;
        clonedReportDataObj.description = this.description;
        clonedReportDataObj.is_public = this.isPublic;

        return clonedReportDataObj;
      },

      getSdReportParams(){

        const sdReportForkData = {}

        const fromFilterReport = JSON.parse(JSON.stringify(this.reportDataObj))
        if(this.modalMode === 'update') { // assign null to report id to create a fresh new report
          sdReportForkData.id = fromFilterReport.id;
        }

        sdReportForkData.name = this.name;
        sdReportForkData.description = this.description;
        sdReportForkData.is_public = this.isPublic;
        sdReportForkData.chart_type = this.chartType;
        sdReportForkData.filters = this.formattedFilterData();
        sdReportForkData.is_plugin = 1;
        sdReportForkData.type = parseInt(fromFilterReport.type);
        sdReportForkData.is_default = 0;
        sdReportForkData.parentId = fromFilterReport.id;

        return  sdReportForkData;
      },

      formattedFilterData(){

        let val = getFormattedFilterValues(this.filterArray,this.filterValues);

        return Object.keys(val)
            .filter(keyOne => {
              return boolean(val[keyOne])
            })
            .map(key => {
              let value = val[key];
              return {key: key, value: value}
            })
      },

      redirectToReporListPage() {
        setTimeout(() => this.$router.push({ name : 'Reports Index'}), 1000); // close the modal after 1 second
      },

      // Assign value to component properties
      onPropertyChange(value, property) {
        this[property] = value;
      },
    },

    components: {
      'text-field': TextField,
      'checkbox': Checkbox
    }
  }

</script>

<style>
</style>
