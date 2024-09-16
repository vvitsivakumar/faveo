<template>

	<div class="display_in" v-if="!archive">

		<button type="button"  v-tooltip="lang('assign-ticket')" :style="buttonStyle"
			class="btn btn-md bg-white btn-default" @click="modalMethod('assign_ticket','showAssignModal')" id="assign">

			<i  class="far fa-hand-point-right"></i>
		</button>

		<button type="button" v-tooltip="lang('merge-ticket')" class="btn btn-md bg-white btn-default"
			:style="buttonStyle" @click="modalMethod('merge-ticket')" id="merge">

			<i  class="fas fa-cogs"></i>
		</button>

		<button v-if="page === 'trash'" type="button" v-tooltip="lang('delete-tickets')"

			class="btn btn-md btn-danger" @click="modalMethod('delete-ticket','showDeleteModal')" id="delete">

			<i class="fas fa-trash"></i>&nbsp;{{lang('delete_forever')}}
		</button>

		<div class="btn-group" :key="statusDiv">

			<button v-tooltip="lang('change_status')" type="button" class="btn btn-md bg-white btn-default dropdown-toggle"
				data-toggle="dropdown" :style="buttonStyle" @click="getStatusList()" id="status">
				<i class="fas fa-exchange-alt"> </i>
			</button>

			<div class="dropdown-menu status-list" v-if="selectedTickets.length > 0">

				<div  v-if="loading" class="row">

						<reuse-loader :animation-duration="4000" color="#1d78ff" :size="30"/>
				</div>

				<template v-if="!loading">

					<template v-if="statusList && statusList.length > 0">

						<a v-for="status in statusList" class="dropdown-item" @click="getStatus(status)" href="javascript:;">

							<i :class="status.icon" :style="{color:status.icon_color}"> </i> &nbsp;{{status.name}}
						</a>
					</template>

					<a v-if="statusList && statusList.length === 0" class="dropdown-item" href="javascript:;">
						{{lang('no-records')}}
					</a>
				</template>
			</div>
		</div>

		<transition name="modal">

			<change-status-modal v-if="showStatusModal" :onClose="onClose" :showModal="showStatusModal"
				:ticketIds="selectedTickets" :status="change_status" componentTitle="inbox" :reloadTickets="loadTickets" :label="true">

			</change-status-modal>
		</transition>

		<transition name="modal">

			<assign-ticket-modal v-if="showAssignModal" :onClose="onClose" :showModal="showAssignModal"
				:ticketIds="selectedTickets" componentTitle="inbox" :reloadTickets="loadTickets" :tickets="tickets">

			</assign-ticket-modal>
		</transition>

		<transition name="modal">

			<merge-ticket-modal v-if="showMergeModal" :onClose="onClose" :showModal="showMergeModal"
				:ticketIds="selectedTickets" componentTitle="inbox" :reloadTickets="loadTickets">

			</merge-ticket-modal>
		</transition>

		<transition name="modal">

			<delete-ticket-modal v-if="showDeleteModal" :onClose="onClose" :showModal="showDeleteModal"
				:ticketIds="selectedTickets" componentTitle="inbox" :reloadTickets="loadTickets">

			</delete-ticket-modal>
		</transition>
	</div>
</template>

<script>

	import {arrayUnique, lang } from "../../../../../../helpers/extraLogics";

	import {errorHandler, successHandler } from "../../../../../../helpers/responseHandler";

	import axios from 'axios';
	import ChangeStatusModal from "../../../../TicketsComponents/ChangeStatusModal.vue";
	import MergeTicketModal from "../../../../TicketsComponents/MergeTicketModal.vue";
	import AssignTicketModal from "../../../../TicketsComponents/AssignTicketModal.vue";
	import DeleteTicketModal from "../../../../TicketsComponents/DeleteTicketModal.vue";
	
	export default {

		name : 'ticket-actions',

		description : 'Ticket actions component',

		props : {

			selectedTickets : { type : [Array,String], default : ()=>[]},

			tickets : { type : [Array,String], default : ()=>[]},

			buttonStyle : { type : Object, default : ()=>{}},

			loadTickets : { type : Function },

			page : { type : String, default : '' },

      archive : {type : Boolean, default : false},

      label: { type: String, default: '' },
		},

		data() {

			return {

				loading : false,

				parent_tickets : [],

				showStatusModal : false,

				change_status : '',

				statusList : '',

				showAssignModal : false,

				showMergeModal : false,

				showDeleteModal : false,

				statusDiv : 0,
			}
		},

		methods : {

			modalMethod(modal,name){

				if(modal !== 'merge-ticket'){

					if(this.selectedTickets.length > 0){

						this[name] = true;
					} else {

						alert('Please select tickets.')
					}

				} else {

					this.mergeTicket(modal);
				}
			},

			getStatusList(){

				this.statusList = '';

				if(this.selectedTickets.length > 0){

					this.loading = true;

					let params = {meta: true, supplements:arrayUnique(this.selectedTickets),limit : 'all'}

					axios.get('/api/dependency/statuses',{params}).then(res =>{

						this.loading  = false

						this.statusList=res.data.data.statuses;

					}).catch(err=>{

						this.loading  = false
					})
				} else {

					this.statusDiv +=1;

					alert('Please select tickets.')
				}
			},

			getStatus(status){

				if(this.selectedTickets.length > 0){

					this.showStatusModal = true

					this.change_status = status

				}else {

					alert('Please select tickets.');

					this.showStatusModal = false
				}
			},

			mergeTicket(modal){

				if(this.selectedTickets.length > 1){

					this.showMergeModal = true

				}else {

					this.showMergeModal = false

					alert(lang('please_select_more_than_2_tickets'));
				}
			},

			onClose(){

				this.statusDiv ++;

				this.showStatusModal = false;

				this.showAssignModal = false;

				this.showMergeModal = false

				this.showDeleteModal = false;

				this.$store.dispatch('unsetValidationError');
			},
		},

		components : {

			'change-status-modal': ChangeStatusModal,

			'merge-ticket-modal': MergeTicketModal,

			'assign-ticket-modal': AssignTicketModal,

			'delete-ticket-modal' : DeleteTicketModal

		}
	};
</script>

<style scoped>

	/*#assign,#merge,#status,#delete{ margin: 2px; }

	#assign,#merge { padding-bottom: 8px;	}

	#status{ margin-left: 3px; }*/

	.display_in { display: inline-block; }
</style>