<template>
  
  <nav class="main-header navbar navbar-expand" :class="callingFrom == 'admin' ? portal.admin_header_color : portal.agent_header_color">

	 	<ul class="navbar-nav">

      <li class="nav-item">

        <a class="nav-link" href="javascript:;" role="button" @click="pushMenu" data-widget="pushmenu"><i
            class="fas fa-bars"></i></a>
      </li>

		</ul>

    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a v-if="callingFrom == 'admin'"
           class="nav-link"
           :href="basePath()+'/panel/dashboard'"
           v-tooltip="trans('switch_to_agent_panel')">
          <i class="fa-solid fa-user-tie m-auto"></i>
        </a>
      </li>

      <li v-if="!callingFrom && auth.user_data.role == 'admin'" class="nav-item">

        <a class="nav-link" :href="basePath()+'/admin/home'" v-tooltip="trans('switch_to_admin_panel')"><i class="fa-solid fa-user-gear m-auto"></i></a>
      </li>

				<a class="nav-link" href="javascript:;" v-if="!showSearchBar && callingFrom != 'admin'">
					<div >
						<i class="fas fa-search" @click="showSearchBar=true"></i>
					</div>
				</a>

				<global-search v-if="showSearchBar" @close-search-bar="handleCloseSearchBar" :userId="auth.user_data.id" :callingFrom="callingFrom" :headerBackground="callingFrom == 'admin' ? portal.admin_header_color : portal.agent_header_color"></global-search>

		    <template v-if="auth.user_data.role == 'admin'">

				<application-updates :callingFrom="callingFrom" :headerBackground="callingFrom == 'admin' ? portal.admin_header_color : portal.agent_header_color"></application-updates>
			</template>

			<inapp-notification :userId="auth.user_data.id" :callingFrom="callingFrom" :headerBackground="callingFrom == 'admin' ? portal.admin_header_color : portal.agent_header_color"></inapp-notification>
			<template v-if="!callingFrom">

				<li id="nav-id" class="nav-item">{{navbarMounted()}}</li>
			</template>

      <language-dropdown :language="userLang"></language-dropdown>

      <li class="nav-item dropdown user-menu">
        <a href="javascript:;" class="nav-link dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
        <span class="d-none d-md-inline mr-1" v-tooltip="auth.user_data.full_name" dir="auto">
            {{ subString(auth.user_data.full_name) }}
            <img :src="auth.user_data.profile_pic" class="user-image img-circle elevation-2 d-none d-md-inline"
                 alt="User Image"/>
        </span>
          <faveo-image-element id="nav-image" :src="auth.user_data.profile_pic"
                               class="user-image img-circle elevation-2 d-md-none" alt="User Image"/>
        </a>
        <ul class="dropdown-menu dropdown-menu-sm dropdown-menu-right rounded model-box rounded text-light dropdown-menu-arrow mt-2 rounded">
          <li>
            <a v-if="callingFrom === 'admin'" class="dropdown-item dp-data" :href="basePath()+'/panel/profile'">
              <i class="fa fa-user pr-2"></i>{{ trans('profile') }}
            </a>
            <router-link v-else class="dropdown-item dp-data " to="/profile"><i
                class="fa fa-user pr-2"></i>{{ trans('profile') }}
            </router-link>
          </li>
          <li>
            <a href="javascript:;" class="dropdown-item dp-data mb-4 mt-1" @click="signOut">
              <i class="fas fa-sign-out-alt pr-2"></i>{{ trans('sign_out') }}
            </a>
          </li>
        </ul>
      </li>
    </ul>

	 	<custom-loader v-if="loading"  :animation-duration="4000"/>
 	</nav>
</template>

<script>

    import { getSubStringValue } from "../../../helpers/extraLogics";
    import { computed }  from 'vue';
    import { useStore } from 'vuex';
    import AgentLang from "./Mini/AgentLang.vue";
    import InAppNotification from "./Mini/InAppNotification.vue";
    import ApplicationUpdates from "./Mini/ApplicationUpdates.vue";
	import GlobalSearch from "./Mini/GlobalSearch.vue";

	export default {

		name : 'admin-agent-top-navbar',

        setup() {

            const store = useStore();

            return {
                // getter
                getPushMenu: computed(() => store.getters.getPushMenu),
            };
        },

		props : {

			auth : { type : Object, default : ()=>{} },

			portal : { type : Object, default : ()=>{} },

			callingFrom : { type : String, default : '' }
		},

		data() {

			return {
				loading : false,
				showSearchBar: false
			}
		},

		created() {

			this.togglePush();			
		},

		computed : {

      	userLang(){

	        	return this.auth.user_data.user_language ? this.auth.user_data.user_language : 'en'
	      },
        },

	   	methods : {

	   		navbarMounted() {

	   			window.emitter.emit('navbar-mounted');
	   		},

	   		subString(value,length = 30){

				return getSubStringValue(value,length)
			},

		   	signOut(){

			   this.loading = true;

				axios.post('/auth/logout').then(res=>{

					this.loading = false;

					window.location.href = res.data.data ? res.data.data : this.basePath();

				}).catch(error=>{

					this.loading = false;
				})
			},

			pushMenu() {

				this.$store.dispatch('setPushMenu',!this.getPushMenu);

				this.togglePush()
			},

			togglePush() {

				let element = document.getElementById('layout_body');

				setTimeout(()=>{

					if(this.getPushMenu){

						element.classList.add("sidebar-collapse");	
					
					} else {

						element.classList.remove("sidebar-collapse");	
					}
				},1000);				
			},
		    handleCloseSearchBar(newValue) {
			    this.showSearchBar = newValue;
		    }
	   	},

		components : {

			'language-dropdown' : AgentLang,

			'inapp-notification' : InAppNotification,

			'application-updates' : ApplicationUpdates,

			'global-search' : GlobalSearch
		}
	};
</script>
<style scoped>
.model-box {
  margin-top: 8px !important;
  padding-top: 9px !important;
  width: 178px !important;
  height: 82px !important;
  background-color: #4f5962;

}

.dp-data {
  color: #c2c7d0 !important;
}

.dp-data:hover {
  background-color: #717985;
  color: white !important;
}

.fa-user {
  margin-right: 1px;
}

.navbar-nav > .user-menu .user-image {
  height: 28px !important;
  width: 28px !important;
  margin-left: 4px;
  margin-top: -4px;
  margin-right: -10px;

}

.dropdown-menu-arrow::before {
  content: "" !important;
  position: absolute !important;
  top: -10px !important;
  left: 88%;
  transform: translate(-50%);
  border-width: 3px 7px 8px;
  border-style: solid;
  border-color: transparent transparent #3e4d5d;
}

.user-info:hover {
  background-color: #eaecf4;

}

.menu-box {
  margin-top: 8px;
  left: -4px;
}

</style>