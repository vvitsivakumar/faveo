<template>

  <div>

    <modal v-if="showModal" :showModal="showModal" :onClose="onClose" :containerStyle="containerStyle">

      <template #title>

        <h4 class="modal-title">{{lang(title)}}</h4>
      </template>

      <template #fields>

        <div v-if="loading" class="row">

          <reuse-loader :animation-duration="4000" color="#1d78ff" :size="size" />
        </div>



        <div class="row">

          <date-time-field id="log_delete_date1" :label="lang('delete_from')"
                           :value="delete_after_date"
                           type="datetime"
                           :time-picker-options="timeOptions"
                           name="delete_after_date"
                           :required="false"
                           :onChange="onChange"
                           :currentYearDate="false"
                           format="YYYY-MM-DD HH:mm:ss" classname="col-sm-4"
                           :clearable="true" :disabled="false">
          </date-time-field>

          <date-time-field id="log_delete_date2" :label="lang('delete_to')"
                           :value="delete_before_date"
                           type="datetime"
                           :time-picker-options="timeOptions"
                           name="delete_before_date"
                           :required="false"
                           :onChange="onChange"
                           :currentYearDate="false"
                           format="YYYY-MM-DD HH:mm:ss" classname="col-sm-4"
                           :clearable="true" :disabled="false">
          </date-time-field>
        </div>
      </template>

      <template #controls>

        <div v-if="title === 'delete_logs'">
          <button id="log_delete_btn" type="button" @click="onSubmit()" class="btn btn-danger" :disabled="isDisabled">
            <i class="fa fa-trash" aria-hidden="true"></i> {{ lang('delete') }}
          </button>
        </div>
      </template>
    </modal>
  </div>
</template>

<script>

import moment from 'moment';
import axios from 'axios';
import {errorHandler,successHandler} from "../../../../../../../resources/assets/js/helpers/responseHandler";
import DateTimePicker
  from "../../../../../../../resources/assets/js/components/MiniComponent/FormField/DateTimePicker.vue";

export default {

  name : 'log-modal',

  description : 'Logs Modal component',

  props:{

    showModal:{type:Boolean,default:false},

    onClose:{type: Function},

    data : { type : Object , default:()=>{}},

    title : { type : String , default :''},


  },

  data:()=>({

    containerStyle:{
      width:'950px'
    },
    /**
     * initial state of loader
     * @type {Boolean}
     */
    loading:false,

    /**
     * size of the loader
     * @type {Number}
     */
    size: 60,

    /**
     * for rtl support
     * @type {String}
     */


    delete_after_date : '',

    delete_before_date : '',

    timeOptions:{
      start: '00:00',
      step: '00:30',
      end: '23:30'
    },

    isDisabled: true,

    systemLogs :  ["systemLogs"]

  }),

  created(){

    this.lang_locale = localStorage.getItem('LANGUAGE');
  },

  methods:{

    onChange(value, name) {
      this[name] = value;

      // Check if either "delete_after_date" or "delete_before_date" has a value
      const eitherDateSelected = this.delete_after_date || this.delete_before_date;

      // Update isDisabled based on eitherDateSelected
      this.isDisabled = !eitherDateSelected;
    },


    onSubmit(){
      //for delete
      this.loading = true;

      const data={};
      data['categories'] =this.systemLogs;
      data['delete_before']=this.delete_before_date !== ''  && this.delete_before_date !== null ? moment(this.delete_before_date).format('YYYY-MM-DD HH:mm:ss') : '';
      data['delete_after']=this.delete_after_date !== '' && this.delete_after_date !== null ? moment(this.delete_after_date).format('YYYY-MM-DD HH:mm:ss') : '';
      axios.delete('/api/delete/logs',{data}).then(res=>{
        successHandler(res,'dataTableModal');
        window.location.reload();
        this.onClose();
        this.loading = false;

      }).catch(err => {
        errorHandler(err,'dataTableModal')
      })
    },

  },

  components:{

    'date-time-field': DateTimePicker,
  }

};
</script>


