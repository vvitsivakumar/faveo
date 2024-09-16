<template>
	
	<div class="inbox-pop">

		<a href="javascript:;" ref="right_click_menu"  v-on:contextmenu=" openContextMenu($event)" v-tooltip="details.title"
			:class="{'fw-400': details.isanswered}" @mousedown="scrollClick($event)">

			<span class="ticket-no" :data-pjax="details.id">[#{{details.ticket_number}}]&nbsp;&rlm;</span>

				{{subString(details.title,50)}}&nbsp;&rlm;(&lrm;{{details.thread_count}})
		</a>

		<popover click arrow placement="right">

			<a v-if="!archive" class="tic-pop mr-1" href="javascript:;" @click="getPopData(details.id)" v-tooltip="trans('click_to_see_details')">

				<i class="fas fa-question-circle tic-pop-i">

				</i>
			</a>

			<template #content>

				<template v-if="!hasData">

					<div class="row" id="load_margin">

						<reuse-loader :animation-duration="4000" color="#1d78ff" :size="30"/>
					</div>
				</template>

				<template v-if="hasData">

					<div class="card card-light card-widget m_5">

					<div class="card-header pad-10">

						<div class="user-block">

						<faveo-image-element id="popover-img" :source-url="details.from.profile_pic" :classes="['img-circle']"/>

						<div>
						<span class="username text-capitalize mb-6"
							v-tooltip="popUpData.user_name ? popUpData.user_name : popUpData.email">

							<a href="javascript:;">
								{{popUpData.user_name ? subString(popUpData.user_name,30) : subString(popUpData.email,30) }}
							</a>
						</span>

						<span class="description fw-400">{{lang('created_at')}} :  {{formattedTime(popUpData.created_at)}}

						</span></div>
						</div>
					</div>

					<div class="card-body pb-0 pad-10">

						<p v-html="popUpData.body"></p>
					</div>
				</div>
				</template>
			</template>
		</popover>
		<span v-if="details.attachment_count !== 0" class="mr-1"><i class="glyphicon glyphicon-paperclip"></i></span>

		<span v-if="details.collaborator_count !== 0 && details.collaborator_count !== null" class="mr-1"><i class="fas fa-users"></i></span>

		<template v-for="(label,index) in details.labels">

			<a href="javascript:;" v-tooltip="lang(label.value)" class="badge mr-1"
				:style="{'backgroundColor' : label.color, 'color': '#FFF'}">{{subString(label.value)}}

			</a>
		</template>
	</div>
</template>

<script>
	
	import { getSubStringValue } from "../../../../../../helpers/extraLogics";

	import {useStore} from 'vuex'

	import axios from 'axios'
	import {computed} from "vue";

	export default {

		name : 'ticket-popover',

		setup() {

			const store = useStore();

			return {

				formattedTime : computed(()=>store.getters.formattedTime)
			}
		},

		props : {

			details : { type : Object, default : ()=> {} },

			tableHeader : { type : String, default : ''},

			onTicketClick : { type : Function },

      archive : { type : Boolean, default : false}
		},

		data () {

			return {

				bgStyle : { background : this.tableHeader },

				hasData : false,

				popUpData : '',

				delay: 300,
				
				clicks: 0,
				
				timer: null
			}
		},
    mounted() {
      console.log('details', this.details)
    },

    methods : {

			subString(value,length = 10){

				return getSubStringValue(value,length)
			},

			getPopData(id) {

				this.hasData = false;

				axios.get('/ticket/tooltip?ticketid='+id).then(res=>{

					this.hasData = true;

					this.popUpData = res.data;

				}).catch(err=>{

					this.hasData = false;
				})
			},

			onClick(id,e){

				if(!e.target.className.includes('tic-pop') && !e.target.className.includes('tic-pop-i')) {

					this.$store.dispatch('setTicketId', id);

					this.clicks++

					if(this.clicks === 1) {

						this.timer = setTimeout(()=> {

							this.clicks = 0

							this.onTicketClick(id)

						}, this.delay);
					} else{

						this.redirectMethod(id);
					}
				}
		  },

		  redirectMethod(id,tab) {

		  		this.clicks = 0;

				clearTimeout(this.timer);  

				if(tab == '_blank') {
					
					window.open(this.basePath()+'/panel/thread/' + id, "_blank");
				} else {
	
					this.$router.push({ path : '/thread/'+id})
				}
		  },

			openContextMenu(e){
				
				let titleEl=this.$refs.right_click_menu;

        if(this.archive)
        {
          titleEl.href = this.basePath()+"/admin/tickets-archive/show";
        }else
        {
          titleEl.href = this.basePath()+"/panel/thread/"+this.details.id;
        }
			},
			
			scrollClick(e) {

				if (e.button === 1) {

					this.openContextMenu();
				}
			},
		}
	};
</script>

<style scoped>
	
	.vue-popover{ width: 60% !important; top:auto !important; left:auto !important; }
	
	#load_margin { margin-top: 15px;margin-bottom: 15px; width: 300px; height: 50px; }

	.m_5 { margin : -5px; }

	.ticket_label{ font-size: 10px; }

	.mb-6 { margin-bottom: 6px; }

	.fw-400 { font-weight: 400; }

	.pad-10 { padding: 10px; }
</style>