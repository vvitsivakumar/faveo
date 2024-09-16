<template>

	<div id="tickets-index">

		<alert componentName="inbox"></alert>

		<div class="card card-light" id="ticket-list-body">

			<div class="card-header">

				<h3 class="card-title">{{trans('tickets')}}</h3>
				<div class="card-tools" v-if="!loading && !archive">

					<button type="button" class="btn btn-tool" v-tooltip="trans('filter_tickets')" @click="toggleFilterView()">

						<i class="glyphicon glyphicon-filter"></i>
					</button>

			      <button type="button" class="btn btn-tool" :class="hasDataPopulated ? 'rotating': ''" data-card-widget="refresh" @click="refreshIndex()"
			          	v-tooltip="trans('refresh')">

			        	<i class="fas fa-sync-alt"></i>
			      </button>
				</div>

        <div  class="card-tools" v-if="!loading & archive">

          <button type="button" class="btn btn-tool" data-card-widget="backup" @click="backUpStart()"
                  v-tooltip="trans('this_will_move_closed_tickets_to_archive')">

            <i class="fas fa-archive"></i>
          </button>

<!--          <button type="button" class="btn btn-tool" data-card-widget="delete" @click="onDelete()"-->
<!--                  v-tooltip="trans('delete')">-->

<!--            <i class="fas fa-trash"></i>-->
<!--          </button>-->
          <button type="button" class="btn btn-tool" :class="hasDataPopulated ? 'rotating': ''" data-card-widget="refresh" @click="refreshArchive()"
                  v-tooltip="trans('refresh')">

            <i class="fas fa-sync-alt"></i>
          </button>
        </div>

			</div>

			<div class="card-body">

				<div v-if="!loading" class="row">

					<div class="col-md-12">

						<div class="search-div form-group form-inline float-right VueTables__search">

							<div class="VueTables__search-field">

                <div class="input-group ticket-searchbar mb-3">
                  <div class="input-group-prepend">
                    <button type="button" class="btn btn-default dropdown-toggle filter-ticket" data-toggle="dropdown">
                      {{lang('search_by')}}
                    </button>
                    <div class="dropdown-menu filter-column">
                      <div v-for="(value, key) in searchShortCode">
                        <a class="dropdown-item search-filter" @click="(event) => toggleSearchFilter(event, key)">
                              <i v-if="searchFilter.includes(key)" class="fas fa-check"></i>&nbsp;
                            <span class="search-text" :class="!searchFilter.includes(key) ? 'ml-3' : ''" >{{value}}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  <input type="text" class="form-control" :placeholder="lang('type_and_enter_to_search')" v-model="search" autocomplete="off"
                         @keyup.enter="doSearch($event ,search)" @keydown="handleKeyDown($event)" :class="{ 'highlighted': isHighlighted }">
                </div>
              </div>
						</div>

						<div class="form-group float-left VueTables__limit">

							<div class="VueTables__limit-field ">

								<button type="button" class="btn btn-default btn-md bg-white cursor_def" v-tooltip="trans('select_all_tickets')">

								 	<select-all :tickets="ticketsArray" :selected="selectedTickets">

									</select-all>
								</button>

								<ticket-actions v-if="selectedTickets.length"  :archive="archive" :selectedTickets="selectedTickets" :loadTickets="refreshTickets" :page="sourceType"
									:tickets="ticketsArray">

								</ticket-actions>

								<per-page v-if="perpage" :perpage="perpage" :tableHeader="selectedColor"
									v-on:ticketCount="handlePageCount">

								</per-page>

								<ticket-sorting v-on:sort="sorting" v-on:filter="filtering" :tableHeader="selectedColor"></ticket-sorting>

							</div>
						</div>

					</div>
				</div>

				<div v-if="loading && hasDataPopulated" style="padding: 1rem;">

					<BulletListLoader viewBox="0 0 300 200"></BulletListLoader>
				</div>

				<div class="mailbox-messages mailinbox">

				  	<div v-if="isShowFilter">

					  	<ticket-filter v-on:filter="setFilter" :showFilter="isShowFilter"
							:closeFilterView="toggleFilterView">

						</ticket-filter>
					</div>

					<div class="row ticket-box">

						<div v-if="!loading" class="col-md-12 col-sm-12 col-12">

							<table v-if="ticketsArray.length > 0" id="tickets-expanded">

								<tbody>

									<ticket-details v-for="(ticket,index) in ticketsArray" :archive="archive" :ticket="ticket" :key="ticket.id"
										:color="selectedColor" :appendSelect="appendSelect" :onSelect="onTicketSelect"
										:timelineId="timelineId">

									</ticket-details>
								</tbody>
							</table>

							<div v-if="!hasDataPopulated && ticketsArray.length === 0">

								<p class="text-center no-ticket-found">{{trans('no-ticket-found')}}</p>
							</div>
						</div>
					</div>
				</div>

				<div v-if="!loading">

	            <div class="mailbox-controls">

	            	<div class="row">

	            		<div class="col-sm-6 pad-top-18">

                    <template v-if="ticketResponse.total == 1">
                      {{trans('one_record')}}
                    </template>
                    <template v-if="ticketResponse.total > 1 && ticketResponse.total <= 10">
                      {{ ticketResponse.total }} {{trans('records')}}
                    </template>
                    <template v-if="ticketResponse.total > 10">
                      {{trans('showing')}} {{ ticketResponse.from }} to {{ ticketResponse.to }} of {{ ticketResponse.total }} {{trans('records')}}
                    </template>
	            		</div>
	            		<div class="col-sm-6">

	            			<div v-if="ticketResponse.total > 10" class="float-right mr-2">

                      <simple-pagination :prev_page="prev_page" :next_page="next_page"
                                         :onPagination="pageChanged">

                      </simple-pagination>

<!--			                  <uib-pagination id="ticket-page" v-if="ticketResponse.total > 10" :records="ticketResponse.total"
										v-model="pagination" :options="{chunk:5, chunksNavigation:'scroll'}" class="pagination float-right" :boundary-links="true" :per-page="perpage" @paginate="pageChanged">

									</uib-pagination>-->
			               </div>
	            		</div>
	            	</div>
	            </div>
	         </div>
			</div>
		</div>
<div class="time-ab-div">
		<div id="ticket-timeline" class="row">

			<ticket-timeline  v-if="timelineId" :ticketId="timelineId" :archive="archive" :updateTable="reloadData" :key="counter" ref="ticketTimeline" fromComp="index">

				<template #headerMenu v-if="!archive">

					<button class="btn btn-default btn-xs" @click="refreshDetails" v-tooltip="trans('refresh')" href="javascript:;">

						<i class="fas fa-sync-alt"></i>
					</button>

					<button type="button" class="btn btn-default btn-xs" @click="backToInbox" v-tooltip="trans('back_to_inbox')">

						<i class="fas fa-arrow-up"></i>
					</button>

									<button type="button" class="btn btn-default btn-xs" @click="closeTimeline" v-tooltip="trans('close')">

						<i class="fas fa-times"></i>
					</button>
				</template>
			</ticket-timeline>
		</div>
  </div>

	</div>
</template>

<script>

import { BulletListLoader } from 'vue-content-loader'

import  { boolean, getIdFromUrl } from "../../../../helpers/extraLogics";

import {errorHandler, successHandler} from "../../../../helpers/responseHandler";

import axios from 'axios';

import TicketActions from "./Mini/Table/TicketActions.vue";
import TicketDetails from "./Mini/Table/TicketDetails.vue";
import TicketPerPage from "./Mini/Table/TicketPerPage.vue";
import SelectAllTickets from "./Mini/Table/SelectAllTickets.vue";
import TicketSortingMenu from "./Mini/Table/TicketSortingMenu.vue";
import TicketTimeline from "./TicketTimeline.vue";
import TicketFilter from "../../tickets/filters/TicketFilter.vue";
import SimplePagination from "../../../Common/SimplePagination.vue";

export default {

	props: {

		selectedColor: { type: String, default: '' },

		ticketPage: { type: String, default: '' },

    archive:{type: Boolean, default: false},
	},

	data() {

		return {

			buttonStyle: { 'background-color': this.selectedColor + ' !important', 'color': '#fff' },

			loading: true,

			ticketsArray: [],

			ticketResponse: '',

			perpage: '',

			pagination: 1 ,

			paramsObj: {},

			hasDataPopulated: true,

			search: '',

			selectedTickets: [],

			timelineId: '',

			url_params: [],

			/**
			 * `isApplyClicked` is true when filter is applied and saved by the user
			 * This is a fix for issue #4896
			 *
			 * Get filter fileds params from `URL` only when
			 * 1. Redirection
			 * 2. Url parmas changed manualy
			 *
			 */
			isApplyClicked: false,

			activePage : this.ticketPage,

			isShowFilter : false,

			counter : 0,

      next_page : '',

      prev_page :  '',

      searchShortCode: '',

      searchFilter: ['id'],

      filterArray: [],

      sourceType: ''
		}
	},

	beforeMount() {

		let url_params = new URLSearchParams(window.location.search);

		this.timelineId = url_params.get("timelineId") ? url_params.get("timelineId") : '';

    if (!this.archive) {

      if (this.activePage == 'filter') {

        this.activePage = '';

        this.paramsObj['filter_id'] = getIdFromUrl(window.location.pathname);

        this.getTicketList(this.paramsObj)
      } else {

        this.getTicketList()
      }
    }
    else
      {
        this.getArchiveList()
      }

    this.getSearchShorCodes();

    this.search = this.formatSearchFilter();

    this.filterArray.push(this.search);

		window.emitter.emit('updateAgentSidebar');
	},

	mounted() {

		if(this.timelineId) {

			$('html, body').animate({ scrollTop: $('#ticket-timeline').offset().top-70 }, 'slow');
		}
	},

	created() {

		window.emitter.on('refreshInbox', this.getRefreshList);

		window.emitter.on('closeTimelineView', this.closeTimeline);

	},

  computed: {
     //  the input text contains the content generated from 'searchFilter'
    isHighlighted() {
      const generatedContent = this.searchFilter.map(key => ('is:' + key + ' ')).join('');
      return this.search === generatedContent;
    }
  },

  methods: {

    refreshArchive(){
      this.hasDataPopulated = true;

      this.paramsObj['page'] = 1;

      this.getArchiveList(this.paramsObj);

      this.pagination = 1;
    },

		refreshDetails(){

			this.$refs.ticketTimeline.reloadTimeline();
		},

		backToInbox() {

			var elmnt = document.getElementById('tickets-index');

			elmnt.scrollIntoView({ behavior : "smooth"});
		},

		toggleFilterView() {

			this.isShowFilter = !this.isShowFilter;
		},

		reloadData(from) {

			if(from && from == 'duedate') {

				this.ticketsArray = [];

				this.loading = true;
			}

			this.hasDataPopulated = true;

			this.getTicketList(this.paramsObj);
		},

		closeTimeline() {

			var elmnt = document.getElementById('tickets-index');

			elmnt.scrollIntoView({ behavior: "smooth" });

			this.timelineId = '';
		},

		onTicketSelect(id) {

			$('html, body').animate({ scrollTop: $('#ticket-timeline').offset().top-70 }, 'slow');

			let url_params = new URLSearchParams(window.location.search);

			if(url_params.get("timelineId")){

				const paramName = 'timelineId'

				const paramValue = id

				const searchParams = new URLSearchParams(window.location.search)

				searchParams.set(paramName, paramValue)

				const newUrl = `${window.location.origin}${window.location.pathname}?${searchParams.toString()}`

				window.history.replaceState(null, null, newUrl)

			} else {

				const paramName = 'timelineId'

				const paramValue = id;
                
                const currentURL = window.location.href;
                
                const separator = currentURL.includes('?') ? '&' : '?';
                
                const newUrl = `${currentURL}${separator}${paramName}=${paramValue}`;
                
                window.history.replaceState(null, null, newUrl);
			}

			this.timelineId = id;

			this.counter += 1;
		},

		refreshTickets() {

			this.getRefreshList();

			window.emitter.emit("unCheckTicket");

			window.emitter.emit('refreshTicket');
		},

    onDelete() {
      axios.post('/ticket-archive/delete-ticket/?ticket_ids='+this.selectedTickets).then(res=>{
		  this.selectedTickets = [];
        successHandler(res,'inbox');

        this.refreshArchive();

        this.onClose();

      }).catch(err => {
        this.loading = false
        errorHandler(err, 'inbox')
      });
    },

		doSearch(event, value) {

     let removeFilter = this.formatSearchFilter();

      let searchValue = value.replace(removeFilter, '');

      let Decoded = decodeURIComponent(searchValue).replace(/[^\x00-\x7F]/g, '');

			this.commonActions();

			this.paramsObj['page'] = 1;

			this.paramsObj['search-query'] = Decoded.trim();

      this.paramsObj['short_code'] = this.searchFilter;

			if(!this.archive){

				this.getTicketList(this.paramsObj);

		   	} else{

				this.getArchiveList(this.paramsObj);
			}

			this.pagination = 1;

		},
    onPagination(direction) {
      if (!this.archive) {
        this.getTicketList(this.paramsObj, direction);
      } else {
        this.getArchiveList(this.paramsObj, direction);
      }
      this.hasDataPopulated = true;
      let elmnt = document.getElementById('tickets-index');
      elmnt.scrollIntoView({ behavior: "smooth" });
    },
		getTicketList(params, direction='') {

			let  x = '';

			if(!this.isApplyClicked) {

				var search = location.search.substring(1);

				if(search.length!==0){

					this.url_params=JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"').replace(/%2F/g, '\/') + '"}')
				}

				// Using Object spread syntax for merging filter values
				x = { ...this.handleUrlParamsInTicketFilter(x), ...params};

				params = x ? x : params;
			}

			let category = this.activePage;

			category = category === 'trash' ? 'deleted' : category;

			axios.get('/api/agent/ticket-list?category=' + category, {
				params
			}).then(res => {

				this.ticketResponse = res.data.data;

				this.perpage = parseInt(this.ticketResponse.per_page);

				this.ticketsArray = res.data.data.tickets;

        this.next_page = res.data.data.next_page_url;

        this.prev_page = res.data.data.prev_page_url;

        this.sourceType = this.ticketResponse.category === 'deleted' ? 'trash' : this.ticketResponse.category

        this.loading = false;

        this.hasDataPopulated = false;

				if(!this.ticketsArray.length && this.pagination != 1) {

					this.pagination = 1;

					this.paramsObj['page'] = 1;

					this.getTicketList(this.paramsObj);
				}
			}).catch(error => {

				this.loading = false;

        errorHandler(error, 'inbox');

				this.hasDataPopulated = false;
			})
		},

    getPageNumberFromUrl(url) {
      const regex = /[?&]page=(\d+)/;
      const match = url.match(regex);
      return match ? parseInt(match[1]) : null;
    },

    getArchiveList(params, direction='') {
      let x = '';

      if (!this.isApplyClicked) {
        var search = location.search.substring(1);
        if (search.length !== 0) {
          this.url_params = JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/%2F/g, '\/') + '"}')
        }

        x = { ...this.handleUrlParamsInTicketFilter(x), ...params};
        params = x ? x : params;
      }

      let category = this.activePage;
      category = category === 'trash' ? 'deleted' : category;

      if (direction === 'next' && this.next_page) {
        const next_page = this.getPageNumberFromUrl(this.next_page);
        params['page'] = next_page;
      }

      if (direction === 'previous' && this.prev_page) {
        const prev_page = this.getPageNumberFromUrl(this.prev_page);
        params['page'] = prev_page;
      }

      axios.get('ticket-archive/view-tickets' + category, {
        params
      }).then(res => {
        this.ticketResponse = res.data.data;
        this.perpage = parseInt(this.ticketResponse.per_page);
        this.ticketsArray = res.data.data.tickets;
        this.next_page = res.data.data.next_page_url;
        this.prev_page = res.data.data.prev_page_url;
        this.loading = false;
        this.hasDataPopulated = false;

        if(!this.ticketsArray.length && this.pagination != 1) {
          this.pagination = 1;
          this.paramsObj['page'] = 1;
          this.getArchiveList(this.paramsObj);
        }
      }).catch(error => {
        this.loading = false;
        this.hasDataPopulated = false;
      })
    },

    backUpStart(){
      axios.get('ticket-archive/ticket-archive').then(res =>{
        this.loading = false;
        this.refreshArchive();
        successHandler(res,'inbox');
        let data =res.data.data;
      }).catch(err => {
        this.loading = false
        errorHandler(err, 'inbox')
      });
    },

		refreshIndex() {

			this.hasDataPopulated = true;

			this.paramsObj['page'] = 1;

			this.getTicketList(this.paramsObj);

			window.emitter.emit('updateAgentSidebar');

			this.pagination = 1;
		},

		commonActions() {

			this.selectedTickets = [];

			this.hasDataPopulated = true;

			var elmnt = document.getElementById('ticket-list-body');

			elmnt.scrollIntoView({
				behavior: "smooth"
			});
		},

		getRefreshList() {

			this.pagination = this.pagination;

			this.paramsObj['page'] =  this.pagination;

			this.commonActions();

      if(!this.archive){

        this.getTicketList(this.paramsObj);

      }
      else{
        this.getArchiveList(this.paramsObj);
      }
		},

		pageChanged(direction) {

			this.commonActions();

      let page = ''
      if (direction === 'next' && this.next_page) {
        page = this.getPageNumberFromUrl(this.next_page);
      }

      if (direction === 'previous' && this.prev_page) {
        page = this.getPageNumberFromUrl(this.prev_page);
      }

      this.paramsObj['page'] = page;

      if(!this.archive){

        this.getTicketList(this.paramsObj);

      }
      else{
        this.getArchiveList(this.paramsObj);
      }
		},

		handlePageCount(count) {

			this.commonActions();

			this.paramsObj['page'] = 1;

			this.paramsObj['limit'] = count;

      if(!this.archive){

        this.getTicketList(this.paramsObj);

      }
      else{
        this.getArchiveList(this.paramsObj);
      }

			this.pagination = 1;
		},

		sorting(payload) {

			this.commonActions();

			this.paramsObj['answered'] = '';

			this.paramsObj['sort-field'] = payload.value;

			this.paramsObj['sort-order'] = payload.order;

      if(!this.archive){

        this.getTicketList(this.paramsObj);

      }
      else{
        this.getArchiveList(this.paramsObj);
      }
		},

		filtering(payload) {

			this.commonActions();

			this.paramsObj['answered'] = payload.value;

			 if(!this.archive){

        this.getTicketList(this.paramsObj);

      }
      else{
        this.getArchiveList(this.paramsObj);
      }
		},

		appendSelect(ticketId, checked) {

			if (checked) {

				this.selectedTickets.push(ticketId);
			} else {

				this.selectedTickets.splice(this.selectedTickets.indexOf(ticketId), 1);
			}
		},

		setFilter(payload, scroll, isApplyClicked) {

			this.commonActions();
			this.isApplyClicked = isApplyClicked
			const timeRangeFilterOptions = ['due-on', 'created-at', 'updated-at'];

			for (const key in payload) {
				if (payload.hasOwnProperty(key)) {
					if (timeRangeFilterOptions.includes(key)) {
						payload[key] = payload[key];
					}
				}
			}

			this.pagination = 1;
			if (payload.category == '') {
				payload.category = this.url_params['show[]'];
			}
			this.paramsObj = JSON.parse(JSON.stringify(payload));

			this.setParamsAndApplyFilter(this.paramsObj, scroll)
		},

		handleUrlParamsInTicketFilter(filterParams) {
			// get all parameters from the URL. If search by paramters is true, then
			if (boolean(this.url_params['filter-by-url'])) {
				return this.url_params;
			}
			return filterParams;
		},


		/**
		 * This function will parse the params and apply filter to ticket list
		 * TODO: Need refactoring
		 */
		setParamsAndApplyFilter(parameters, scroll = false) {
			/**
			 * `isApplyClicked` is true when filter is applied and saved by the user
			 * This is a fix for issue #4896
			 *
			 * Get filter fields params from `URL` only when
			 * 1. Redirection
			 * 2. Url parmas changed manualy
			 *
			 */
			if (!this.isApplyClicked) {
				let search = location.search.substring(1);
				if (search.length !== 0) {
					this.url_params = JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"').replace(/%2F/g, '\/') + '"}')
				}
				parameters = this.handleUrlParamsInTicketFilter(parameters);
			}

			//  if(typeof parameters !== 'undefined' && parameters.hasOwnProperty('page')){
			//     $("html, body").animate({ scrollTop: $('#ticket-list-body').offset().top-70 }, 500);
			//  }
			if (this.url_params['show[]'] == "trash") {
				this.url_params['show[]'] = "deleted";
				this.deleteForver = true; // TODO:- Find the purpose of this line
			}

			if (typeof parameters === 'undefined') {
				let params = JSON.parse(JSON.stringify(this.paramsObj));

				//checking if params already have a non empty parameter as category and due_on
				params['category'] = (params['category'] !== undefined) ? params['category'] : this.url_params['show[]'];
				params['filter_id'] = getIdFromUrl(this.currentPath());
				this.getTicketList(params);
			} else {
				//only if scroll is passed as true, this will be scrolled
				if (scroll) {
					window.emitter.emit('hideInboxTimeline');
				}
				let params = parameters;
				params['category'] = (params['category'] !== undefined) ? params['category'] : this.url_params['show[]'];

				/**
				 * Condition for adding filter id in api params
				 * @param  {number} id of the filter
				 */
				if (this.showFilter) {
					params['filter_id'] = getIdFromUrl(this.currentPath());
				}
				params['limit'] = this.perpage;
				this.getTicketList(params);
			}
		},

    getSearchShorCodes() {
      // Make GET request to fetch search shortcodes
      axios.get('/filter/search-shortcodes').then(res => {

        // Update searchShortCode data property with the response data
        this.searchShortCode = res.data;

        this.loading = false;

      }).catch(error => {

        this.loading = false;
      })
    },

    toggleSearchFilter(event, key) {
      
      const index = this.searchFilter.indexOf(key);
      if (index !== -1) {
        this.searchFilter.splice(index, 1); // Remove from array if already selected
      } else {
        this.searchFilter.push(key); // Add to array if not yet selected
      }

      let removeFilterRegex = new RegExp('is:[^ ]+\\s', 'g');
      let searchValue = this.search.replace(removeFilterRegex, '');
      this.search = this.formatSearchFilter() + searchValue;

      this.filterArray = this.searchFilter.map(key => ('is:' + key+' '));

      this.preventToCloseBox(event)
    },

    preventToCloseBox(event) {

      event.stopPropagation();
    },

    formatSearchFilter() {
      // Map each element in searchFilter to a string with 'is:'
      return this.searchFilter.map(key => ('is:'+ key+' ')).join('');
    },

    handleKeyDown(event) {
      // Check if backspace key is pressed and all text is selected
      if (event.key === 'Backspace' && this.isAllTextSelected()) {
        // Clear the input field
        this.search = '';
        // Clear the search filters
        this.searchFilter = [];
        // Clear the Filter Array
        this.filterArray = [];
      }
    },

    isAllTextSelected() {

      return document.activeElement.selectionStart === 0 && document.activeElement.selectionEnd === this.search.length;
    },
	},

  watch:{
    search(){

      // Iterate over filterArray and check if each term is still in search
      for (let i = 0; i < this.filterArray.length; i++) {

        const searchTerm = this.filterArray[i];
        // Check if searchTerm is not present in search
        if (!this.search.includes(searchTerm)) {

          let removeFilter = searchTerm.replace('is:', "").trim();

          const index = this.searchFilter.indexOf(removeFilter);
          if (index !== -1) {
            this.searchFilter.splice(index, 1);
          }

          // Remove the element from filterArray
          this.filterArray.splice(i, 1);
          this.search = this.filterArray.filter(term => this.filterArray.includes(term)).join('');
          // Decrement the index as splice changes the array length
          i--;
        }
      }
    },
  },

	components: {

		BulletListLoader,

		'ticket-actions': TicketActions,

		'ticket-details': TicketDetails,

		'per-page': TicketPerPage,

		'select-all': SelectAllTickets,

		'ticket-sorting': TicketSortingMenu,

		'ticket-timeline': TicketTimeline,

		'ticket-filter': TicketFilter,

    'simple-pagination': SimplePagination
	},
};
</script>

<style>
@import '../css/inbox.css';
.mailbox-controls .VuePagination__count { display: none !important;}
</style>

<style scoped>

	#ticket_user{
		width :8%;
	}
	#ticket-page{
		margin-top: 10px;
	}

	#search{
		margin: 2px;
	}

	.refresh_a { margin-top: 8px; }

	.no-ticket-found {
	 line-height: 1.2;
	 font-size: 15px;
	 padding: 1rem;
	}

	.pad-top-18 { padding-top: 18px;padding-bottom: 18px; }

	.cursor_def { cursor: default !important; }

	.VueTables__search-field input {
    	width: auto !important;
	}

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Apply the rotation animation when the button has a class of "rotating" */
  .btn-tool.rotating i {
    animation: rotate 2s linear infinite; /* Adjust the duration and animation properties as needed */
  }

  .filter-column{

    max-width: 450px !important;
    width: 300px !important;
  }

  .search-filter{

    cursor: pointer;
    padding-left: 10px !important;
    max-width: 450px !important;
    width: 300px !important;
  }

  .filter-ticket{
    margin-right : 0 !important;
  }

  div.VueTables__search-field .input-group {
    max-width: 700px !important;
    width: 700px !important;
  }

  /* Responsive adjustment */
  @media (max-width: 768px) {
    div.VueTables__search-field .input-group {
      width: 500px; /* Adjust for smaller screens */
    }
  }

  .highlighted {

    color: #949494; /* Make the text color */
  }

  .search-div{
    margin-bottom: 0 !important;
  }
</style>
