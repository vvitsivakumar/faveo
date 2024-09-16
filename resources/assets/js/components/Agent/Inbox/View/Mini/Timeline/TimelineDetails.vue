<template>

	<div class="row">

		<div class="col-sm-12">

			<div class="card card-light">

				<div class="card-header pbt-8" v-if="!actions.block_ticket_actions">

					<div class="card-tools" >

					<template v-if="!archive">
            <router-link v-if="ticket.assignee" class="col-sm-6" v-tooltip="ticket.assignee.name" :to="ticket.assignee.href.replace(basePath(),'')">


              <span class="badge badge-success text-xs" >{{trans('assigned')}} </span>

            </router-link>

            <span v-else>

              <span class="badge badge-danger text-xs" >{{trans('unassigned')}}</span>&nbsp

            </span>
          </template>
            <template v-else>

              <a v-if="ticket.assignee" class="col-sm-6" v-tooltip="ticket.assignee.name">


                <span class="badge badge-success text-xs" >{{trans('assigned')}} </span>

              </a>

              <span v-else>

              <span class="badge badge-danger text-xs" >{{trans('unassigned')}}</span>&nbsp

            </span>

            </template>

						<button v-if="actions.view_tickets_without_actions" type="button" class="btn btn-xs btn-default" @click="showEditModal = true">

							<i class="far fa-edit"> </i> {{trans('edit')}}
						</button>

						<button  v-if="actions.assign"  type="button" class="btn btn-xs btn-default" @click="showAssignModal = true">

							<i  class="far fa-hand-point-right"> </i> {{trans('assign')}}
						</button>

						<div class="btn-group">

							<button v-if="actions.view_tickets_without_actions" type="button" class="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown"
								@click="getStatusList()" id="status">

								<i class="fas fa-exchange-alt"> </i> {{trans('change_status')}}
							</button>

							<div class="dropdown-menu status-list dropdown-menu-right">

								<div  v-if="loading" class="row">

										<reuse-loader :animation-duration="4000" color="#1d78ff" :size="20"/>
								</div>

								<template v-if="!loading">

									<template v-if="statusList && statusList.length > 0">

										<a v-for="status in statusList" class="dropdown-item"  id="change_status" @click="getStatus(status)"
											href="javascript:;">

											<i :class="status.icon" :style="{color:status.icon_color}"> </i> &nbsp;{{status.name}}
										</a>
									</template>

									<a v-if="statusList && statusList.length === 0" class="dropdown-item"  href="javascript:;">
										{{trans('no-records')}}
									</a>
								</template>
							</div>
						</div>
					</div>
				</div>

				<div class="card-body"  id="ticket_data">

					<div class="row">

						<div class="col-md-12 info-row">

							<div class="row">

								<label class="col-sm-6">{{ trans('created_at') }} </label>

								<a class="col-sm-6" v-tooltip="formattedTime(ticket.created_at)">{{formattedTime(ticket.created_at)}}</a>
							</div>
						</div>

						<div class="col-md-12 info-row">

							<div class="row">

								<label class="col-sm-6">{{ trans('updated_at') }} </label>

								<a class="col-sm-6" v-tooltip="formattedTime(ticket.updated_at)">
                  {{formattedTime(ticket.updated_at)}}
                </a>
							</div>
						</div>

            <div class="col-md-12 info-row">

              <div class="row">

                <label class="col-sm-6">{{ trans('status-changed-at') }} </label>

                <a class="col-sm-6" v-tooltip="formattedTime(ticket.status_changed_at)">
                  {{formattedTime(ticket.status_changed_at)}}
                </a>
              </div>
            </div>

            <div class="col-md-12 info-row">

              <div class="row">

                <label class="col-sm-6">{{ trans('assigned_at') }} </label>

                <a class="col-sm-6" v-tooltip="formattedTime(ticket.assigned_at)">
                  {{formattedTime(ticket.assigned_at)}}
                </a>
              </div>
            </div>

						<div class="col-md-12 info-row" v-if="ticket.status">

							<div class="row">

								<label class="col-sm-6">{{ trans('status') }} </label>

								     <router-link class="col-sm-6" :to="ticket.status.href.replace(basePath(),'')" target="_blank">

                     <span v-tooltip="ticket.status.name" >{{subString(ticket.status.name,30)}}</span>
              				
              				</router-link>
							</div>
						</div>

						<div class="col-md-12 info-row" v-if="ticket.last_replier && ticket.canViewLastReplierProfile">

							<div class="row">

								<label class="col-sm-6">{{ trans('last_replier') }} </label>

                <user-info :from="ticket.last_replier" :tableHeader="color" class="custom-user-info">
                </user-info>
							</div>
						</div>
            <div class="col-md-12 info-row" v-else-if="ticket.last_replier">

              <div class="row">

                <label class="col-sm-6">{{ trans('last_replier') }}</label>

                <a class="permssion-update" v-tooltip="trans('access_denied_now')">{{subString(ticket.last_replier?.full_name)}}</a>&nbsp;
              </div>
            </div>

						<div class="col-md-12 info-row" v-if="ticket.user && ticket.canViewRequestorProfile">

							<div class="row">

								<label class="col-sm-6">{{ trans('requester') }} </label>

                <user-info :from="ticket.user" :archive="archive" :tableHeader="color" class="custom-user-info">
                </user-info>
							</div>
						</div>
            <div class="col-md-12 info-row" v-else>
              <div class="row">

                <label class="col-sm-6">{{ trans('requester') }}</label>

                <a class="permssion-update" v-tooltip="trans('access_denied_now')">{{subString(ticket.user?.full_name)}}</a>&nbsp;
              </div>
            </div>

						<div class="col-md-12 info-row" v-if="ticket.creator && ticket.canViewCreatorProfile">

							<div class="row">

								<label class="col-sm-6">{{ trans('creator') }} </label>

                <user-info :from="ticket.creator" :archive="archive" :tableHeader="color" class="custom-user-info">
                </user-info>
							</div>
						</div>
            <div class="col-md-12 info-row" v-else>

              <div class="row">

                <label class="col-sm-6">{{ trans('creator') }}</label>

                <a class="permssion-update" v-tooltip="trans('access_denied_now')">{{subString(ticket.creator?.full_name)}}</a>&nbsp;
              </div>
            </div>

						<div class="col-md-12 info-row" v-if="ticket.assigned && ticket.canViewAssigneeProfile">

							<div class="row">

								<label class="col-sm-6">{{ trans('assigned_to') }}</label>

                <user-info  :from="ticket.assigned" :tableHeader="color" :archive="archive" class="custom-user-info">
                </user-info>

							</div>
						</div>

            <div class="col-md-12 info-row" v-else-if="ticket.assigned">

              <div class="row">

                <label class="col-sm-6">{{ trans('assigned_to') }}</label>

                <a class="permssion-update" v-tooltip="trans('access_denied_now')">{{subString(ticket.assigned?.full_name)}}</a>&nbsp;
              </div>
            </div>

						<div class="col-md-12 info-row" v-if="!Array.isArray(ticket.assigned_team)">

							<div class="row">

								<label class="col-sm-6">{{ trans('assigned_team') }}</label>
                <router-link class="col-sm-6" :to="ticket.assigned_team.href.replace(basePath(),'')" target="_blank">

                  <span v-tooltip="ticket.assigned_team.name" > {{subString(ticket.assigned_team.name,30)}} </span>

                </router-link>
							</div>
						</div>

						<div class="col-md-12 info-row" v-if="ticket.source" >

							<div class="row">

								<label class="col-sm-6">{{ trans('source') }}</label>

								<router-link class="col-sm-6"  :to="ticket.source.href.replace(basePath(),'')" target="_blank">

			              		<span v-tooltip="ticket.source.name">{{subString(ticket.source.name,30)}}</span>

			              	</router-link>
							</div>
						</div>

						<div class="col-md-12 info-row" v-if="ticket.type">

							<div class="row">

								<label class="col-sm-6">{{ trans('type') }}</label>

								<router-link class="col-sm-6"  :to="ticket.type.href.replace(basePath(),'')" target="_blank">

			              		<span v-tooltip="ticket.type.name">{{subString(ticket.type.name,30)}}</span>

			              	</router-link>
							</div>
						</div>

						<div class="col-md-12 info-row" v-if="ticket.priority">

							<div class="row">

								<label class="col-sm-6">{{ trans('priority') }}</label>

								<router-link class="col-sm-6"  :to="ticket.priority.href.replace(basePath(),'')" target="_blank">

			              		<span  v-tooltip="ticket.priority.name">{{subString(ticket.priority.name,30)}}</span>

			              	</router-link>
							</div>
						</div>

						<div class="col-md-12 info-row" v-if="ticket.departments">

							<div class="row">

								<label class="col-sm-6">{{ trans('departments') }}</label>

								<router-link class="col-sm-6"  :to="ticket.departments.href.replace(basePath(),'')" target="_blank">

                  <span v-tooltip="ticket.departments.name">{{subString(ticket.departments.name,30)}}</span>

			              	</router-link>
							</div>
						</div>

						<div class="col-md-12 info-row" v-if="ticket.sla_plan">

							<div class="row">

								<label class="col-sm-6">{{ trans('sla_plan') }}</label>

								<router-link class="col-sm-6"  :to="ticket.sla_plan.href.replace(basePath(),'')" target="_blank">

			              		<span v-tooltip="ticket.sla_plan.name">{{subString(ticket.sla_plan.name,30)}}</span>

			              	</router-link>
							</div>
						</div>

						<div class="col-md-12 info-row" v-if="ticket.helptopic">

							<div class="row">

								<label class="col-sm-6">{{ trans('helptopic') }}</label>

								<router-link class="col-sm-6"  :to="ticket.helptopic.href.replace(basePath(),'')" target="_blank">

			              		<span v-tooltip="ticket.helptopic.name">{{subString(ticket.helptopic.name,30)}}</span>

			              	</router-link>
							</div>
						</div>

						<div class="col-md-12 info-row" v-if="ticket.location">

							<div class="row">

								<label class="col-sm-6">{{ trans('location') }}</label>

								<router-link class="col-sm-6"  :to="ticket.location.href.replace(basePath(),'')" target="_blank">

				                    <span v-tooltip="ticket.location.name">{{subString(ticket.location.name,30)}}</span>
	
				                </router-link>
							</div>
						</div>
						
						<div class="col-md-12 info-row" v-if="ticket.form">
							
							<div class="row">
								
								<label class="col-sm-6">{{ trans('form') }}</label>
								
								<router-link class="col-sm-6"  :to="ticket.form.href ? ticket.form.href.replace(basePath(),'') : ''" target="_blank">
									
									<span v-tooltip="ticket.form.name">{{subString(ticket.form.name,30)}}</span>
								
								</router-link>
							</div>
						</div>

						<template v-if="timelineData.custom_field_values && timelineData.custom_field_values.length > 0">

							<div v-for="customField in timelineData.custom_field_values" class="col-md-12 info-row">

								<div class="row" v-if="boolean(customField.value)">

									<label class="col-sm-6">{{ customField.label }}</label>

									<ul class="col-sm-6" v-if="Array.isArray(customField.value)">

										<li v-for="(value, index) in customField.value">

											<router-link :to="customField.href[index].replace(basePath(),'')"  target="_blank">
                        <span v-tooltip="value">{{subString(value,30)}}</span>
                        &nbsp;</router-link>
										</li>
									</ul>

									<template v-else>

										<router-link  v-if="customField.field_type === 'date'" class="col-sm-6" :to="customField.href.replace(basePath(),'')"
											v-tooltip="customField.value" target="_blank">{{ customField.value }}</router-link>


										<router-link v-else class="col-sm-6" :to="customField.href.replace(basePath(),'')" target="_blank">
										<span v-tooltip="customField.value"> {{ subString(customField.value,30) }}</span></router-link>
									</template>
								</div>
							</div>
						</template>

						<div id="timeline-meta-list-box" class="col-sm-12">{{timelineMetaListBoxMounted()}}</div>
					</div>
				</div>
			</div>
		</div>

		<transition name="modal">

			<edit-ticket-modal v-if="showEditModal" :onClose="onClose" :showModal="showEditModal"
				:ticketId="id" componentTitle="timeline" :reloadDetails="reloadData" :selectedFormData="ticket.form">

			</edit-ticket-modal>
		</transition>

		<transition name="modal">

			<assign-ticket-modal v-if="showAssignModal" :onClose="onClose" :showModal="showAssignModal"
				:ticketIds="[id]" componentTitle="timeline" :reloadTickets="reloadData" :deptId="ticket.departments ? ticket.departments.id : ''"
				:teamId="ticket.assignee && ticket.assignee.type =='team' ? ticket.assignee.id : ''">

			</assign-ticket-modal>
		</transition>

		<transition name="modal">

			<change-status-modal v-if="showStatusModal" :onClose="onClose" :showModal="showStatusModal"
				:ticketIds="[id]" :status="change_status" componentTitle="timeline" :reloadTickets="reloadData">

			</change-status-modal>
		</transition>
	</div>
</template>

<script>

	import {getSubStringValue, arrayUnique, boolean} from "../../../../../../helpers/extraLogics";

	import {useStore} from 'vuex'

	import axios from 'axios';

	import {computed} from "vue";
	import EditTicket from "./Mini/EditTicket.vue";
	import AssignTicketModal from "../../../../TicketsComponents/AssignTicketModal.vue";
	import ChangeStatusModal from "../../../../TicketsComponents/ChangeStatusModal.vue";
  import UserInfo from "../Table/UserInfo.vue";

	export default {

		name : 'timeline-data',

		setup() {

			const store = useStore();

			return {

				formattedTime : computed(()=>store.getters.formattedTime),

				customFormattedTime : computed(()=>store.getters.customFormattedTime)
			}
		},

		props : {

			ticket : { type : Object, default : () => {}},

      color : { type : String, default :''},

			actions : { type : [Object, String], default : '' },

			afterAction : { type : Function, default : ()=>{} },

			archive:{type: Boolean, default: true},


			id : { type : [String, Number], default : '' },
		},

		data() {

			return {

				timelineData : this.ticket,

				showEditModal : false,

				showAssignModal : false,

				showStatusModal : false,

				change_status : '',

				statusList : '',

				loading : false,
			}
		},

    watch : {

			ticket(newValue,oldValue) {

				this.timelineData['custom_field_values'] = [];

				setTimeout(()=>{

					this.timelineData = newValue;
				},1000);
			}
		},
    methods :{
			getStatusList(){

				this.loading = true;

				let params = {meta: true, supplements:arrayUnique([this.id]),limit : 'all'}

				axios.get('/api/dependency/statuses',{params}).then(res =>{

					this.loading  = false

					this.statusList=res.data.data.statuses;

				}).catch(err=>{

					this.loading  = false
				})
			},

			getStatus(status){

				this.showStatusModal = true

				this.change_status = status
			},

			reloadData(from) {

          	this.afterAction(from);
          },

			subString(value,length = 15){

				return getSubStringValue(value,length)
			},

			timelineMetaListBoxMounted(){
					window.emitter.emit('timeline-meta-box-mounted', this.ticket);
			},

			onClose() {

         	this.showEditModal = false;

				this.showAssignModal = false;

				this.showStatusModal = false;

				this.$store.dispatch('unsetValidationError');
         }
		},

		components : {

			 'edit-ticket-modal' : EditTicket,

			 'assign-ticket-modal': AssignTicketModal,

			 'change-status-modal': ChangeStatusModal,
      UserInfo

		}
	};
</script>

<style scoped>

	#ticket_data{ min-height: 560px;max-height: 560px; overflow-y: auto; }

	#ticket_data::-webkit-scrollbar-track
	{
		background-color: #f1f1f1;
		border-radius:10px;
	}

	#ticket_data::-webkit-scrollbar
	{
		width: 6px;
		background-color: #f1f1f1;
	}

	#ticket_data::-webkit-scrollbar-thumb
	{
		background-color: #c1c1c1;
		border-radius: 10px;
	}

	.info-row { border-top: 1px solid #f4f4f4; padding: 10px; }

	.pbt-8 {
		padding-bottom: 8px !important;
    padding-top: 8px !important;
	}
  .custom-user-info{
    margin-left: 7px!important;
  }
  .permssion-update{
    margin-left: 6px;
    color:#3c8dbc;
  }
</style>
