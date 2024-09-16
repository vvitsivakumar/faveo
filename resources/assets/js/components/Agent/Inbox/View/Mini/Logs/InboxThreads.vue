<template>

  <div class="inbox-threads">

      <div :class="{'scrollable-thread' : !maximized}" id="thread_scroll">

        <div class="timeline" v-if="inboxThreads">

          <template v-for="(thread,index) in inboxThreads" :key="'thread'+index">

            <div class="time-label" v-if="checkDate(index)">

              <span class="bg-default border">{{formattedDate(thread.created_at)}} </span>
            </div>

            <thread-body :thread="thread" :archive="archive" :index="index" :max="maximized"></thread-body>

            <div v-if="showThreadEnd(index)">

              <i class="fas fa-history bg-gray"></i>
            </div>
          </template>

          <infinite-loading @infinite="getData" ref="infiniteLoading">
			  <template #spinner><span></span></template>
			  <template #complete><span></span></template>
          </infinite-loading>

        </div>
      </div>
  </div>
</template>

<script>

import {useStore} from 'vuex';

import { errorHandler } from "../../../../../../helpers/responseHandler";

import axios from 'axios';

import  { getIdFromUrl, isArchive } from "../../../../../../helpers/extraLogics";
import ThreadBody from "./Mini/ThreadBody.vue";
import {computed} from "vue";

export default {

  name : 'inbox-threads',

  description : 'Inbox Threads Component',

	setup() {

		const store = useStore();

		return {

			formattedTime : computed(()=>store.getters.formattedTime),

			formattedDate : computed(()=>store.getters.formattedDate)
		}
	},

  props : {

	  ticketId : { type : [String, Number], default : '' },

	archive : {type : Boolean, default : false},

    maximized : { type : Boolean, default : false }
  },

  data() {

    return {

      inboxThreads : [],

      page : 1,

      showLoader: false,

      ticketNum : this.ticketId,

      refreshThreads: false,
    }
  },

	created() {
    window.emitter.on('updateTimelineThreads', ()=> this.refreshThreads = true);
  },

  watch : {

      showLoader(newValue,oldValue){

        this.$emit('loaderState',newValue);

        this.showLoader = newValue;

        return newValue
      },

      refreshThreads(value){

        if(value=== true){

          this.updateLogs();
      }

      this.refreshThreads = false;

      }

    },

  methods : {

    updateLogs() {

      this.showLoader = true;

      this.inboxThreads = [];

      this.page = 1;

      this.getThreads(undefined, true);
    },

    getData($state, isRefresh = false){
      this.archive == true ? this.getArchiveThread($state, isRefresh) : this.getThreads($state, isRefresh)
    },

    getThreads($state, isRefresh = false) {

      this.showLoader = true;

      this.ticketNum = this.ticketId ? this.ticketId :  getIdFromUrl(window.location.pathname);

      axios.get('/api/agent/ticket-conversation/'+this.ticketNum+'?time='+Date.now(), { params: { page: this.page } }).then(res => {

		  if(isRefresh) {

			  this.inboxThreads = res.data.data.data;

		  } else {

			  this.inboxThreads.push(...res.data.data.data);
		  }

		  $state && $state.loaded();

		  if (res.data.data.data.length < 10) $state && $state.complete();

		  this.page++;

		  this.showLoader = false;

      }).catch(error => {

        errorHandler(error, 'inbox-threads');

        this.inboxThreads = [];

		this.showLoader = false;

      })
    },
    getArchiveThread($state, isRefresh = false)
    {
      this.showLoader = true;

      this.ticketNum = this.ticketId ? this.ticketId :  getIdFromUrl(window.location.pathname);

      axios.get('/ticket-archive/ticket-conversation/'+this.ticketNum, { params: { page: this.page } }).then(res => {

		  if(isRefresh) {
			  this.inboxThreads = res.data.data.data;
		  } else {
			  this.inboxThreads.push(...res.data.data.data);
		  }
		  $state && $state.loaded();
		  if (res.data.data.data.length < 10) $state && $state.complete();
		  this.page++;
		  this.showLoader = false;

      })
          .catch(error => {

        errorHandler(error, 'inbox-threads');

        this.inboxThreads = [];

			  this.showLoader = false;

      })

    },

    checkDate(x){

      if(x==0){

        return true;

      }else{

        var date1=this.formattedDate(this.inboxThreads[x-1].created_at);

        var date2=this.formattedDate(this.inboxThreads[x].created_at);

        if(date1!=date2){

          return true;
        }
      }
    },

    showThreadEnd(x){

      return x === this.inboxThreads.length-1
    }
  },

  components : {

    'thread-body' : ThreadBody
  }
};
</script>

<style scoped>

.refresh_a { cursor: pointer;color: #777 !important; }

  #thread_scroll::-webkit-scrollbar-track
  {
    background-color: #f1f1f1;
    border-radius:10px;
  }

  #thread_scroll::-webkit-scrollbar
  {
    width: 6px;
    background-color: #f1f1f1;
  }

  #thread_scroll::-webkit-scrollbar-thumb
  {
    background-color: #c1c1c1;
    border-radius: 10px;
  }

  .scrollable-thread {
    min-height: 120px;
    max-height: 523px;
    overflow-y: auto;
  }
</style>
