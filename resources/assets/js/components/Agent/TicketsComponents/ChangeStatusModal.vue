<template>

  <modal v-if="showModal" :showModal="showModal" :onClose="onClose" :containerStyle="containerStyle">

    <template #title>

      <h4 class="modal-title">{{lang('change_status_confirmation') +' '+status.name+ '?'}}</h4>
    </template>

    <template #fields>

        <div class="row" v-focus-first-input>

          <strong  v-if="label" class="ml-1 p-1">{{ lang(status.comment ? 'leave_comment_status_change_required' : 'leave_comment_status_change_optional') }}<span class="is-danger" v-if="status.comment">*</span></strong>

          <tiny-editor-with-validation id="commnetValue"
                                       name="commnetValue"
                                       :value="commnetValue"
                                       :label="lang(status.comment ? 'leave_comment_status_change_required' : 'leave_comment_status_change_optional')"
                                       :onChange="onChange"
                                       :required="status.comment ? true : false"
                                       :mediaOption="false"
                                       classname="col-sm-12">
          </tiny-editor-with-validation>
        </div>

        <div class="col-sm-12">

            <input class="checkbox_align" type="checkbox" v-model="checked">&nbsp;{{lang('post_comment_as_reply')}}
      </div>

        <custom-loader v-if="loading" :duration="4000" />

    </template>

    <template #controls>

      <button id="submit_btn" type="button" @click="validate()" class="btn btn-primary" :disabled="isDisabled">

        <i class="fa fa-check" aria-hidden="true"></i> {{lang('proceed')}}
      </button>
    </template>
  </modal>
</template>

<script type="text/javascript">

import {errorHandler,successHandler} from "../../../helpers/responseHandler";

import {validateChangeStatusSettings} from "../../../helpers/validator/changeStatusSettingsRules.js"

import axios from 'axios'
import TextField from "../../MiniComponent/FormField/TextField.vue";

export default {

  name : 'change-status-modal',

  description : 'Change status Modal component',

  props:{

    showModal:{type:Boolean,default:false},

    ticketIds : { type : Array, default : ()=>[]},

    status : { type : Object, default : ()=>{}},

    onClose:{type: Function, default : ()=>{}},

    componentTitle : { type : String, default :'UserTickets'},

    reloadTickets : { type : Function, default: () => {} },

    label: { type: String, default: '' },
  },

  data:()=>({

    isDisabled:false,

    containerStyle: {width: '800px'},

    loading:false,

    commnetValue : '',

    checked : false
  }),

  methods:{

    isValid(){

      const {errors, isValid} = validateChangeStatusSettings(this.$data);

      if(!isValid){

        return false
      }

      return true
    },

    validate() {

      if(this.status.comment){

        if(this.isValid()){

          this.onSubmit()
        }
      } else {
        this.onSubmit()
      }
    },

    onSubmit(){

      this.loading = true

      this.isDisabled = true

      axios.post('/ticket/change-status/'+this.ticketIds+'/'+this.status.id,
          {
            'comment': this.commnetValue,
            'as-reply': this.checked
          }).then(res=>{

        this.loading = false;

        this.isDisabled = true;

        this.reloadTickets('status');

        successHandler(res,this.componentTitle);

        window.emitter.emit(this.componentTitle+'refreshData');

        window.emitter.emit(this.componentTitle+'uncheckCheckbox');

        window.emitter.emit('refreshUserReport')

        window.emitter.emit('refreshOrgReport')

        this.onClose();

      }).catch(err => {

        this.loading = false;

        this.isDisabled = false

        errorHandler(err,this.componentTitle);

        this.onClose();
      })
    },

    onChange(value, name){

      this[name]= value;
    },
  },

  components:{

    'text-field': TextField,
  }
};
</script>

<style scoped>
.label_align1 {

  display: block; padding-left: 10px; text-indent: -15px; font-weight: 500 !important; padding-top: 0px;
}
.checkbox_align {
  display:inline !important;width: 13px; height: 13px; padding: 0; margin:0; vertical-align: bottom; position: relative;
  top: -3px; overflow: hidden;
}
</style>