<template>

	 <aside class="main-sidebar elevation-4" :class="callingFrom == 'admin' ? portal.admin_sidebar_color : portal.agent_sidebar_color">

		 <template v-if="callingFrom == 'admin'">

			 <a :href="company.website" class="brand-link text-center" v-bind:style="{ top: alertData ? alertWrapper +'px !important' : '' }"  :class="portal.admin_header_color != 'navbar-light' ? portal.admin_header_color : ''">

				<img :src="portal.logo" alt="AdminLTE Logo" class="brand-image ml-0 float-none">
			 </a>
		 </template>

		 <template v-else>

			 <a :href="company.website" class="brand-link text-center" v-bind:style="{ top: alertData ? alertWrapper +'px !important' : '' }" :class="portal.agent_header_color != 'navbar-light' ? portal.agent_header_color : ''">

				 <img :src="portal.logo" alt="AdminLTE Logo" class="brand-image ml-0 float-none">
			 </a>
		 </template>

		 <template v-if="callingFrom == 'admin'">

			 <admin-navigation-bar :auth="auth" from="admin"></admin-navigation-bar>

		 </template>

		 <template v-else>

			 <agent-navigation-bar :auth="auth" from="agent"></agent-navigation-bar>

		 </template>
   </aside>
</template>

<script>

    import AgentNavigationBar from "../../Navigation/AgentNavigationBar.vue";
    import AdminNavigationBar from "../../Navigation/AdminNavigationBar.vue";

	export default {

		name : 'admin-agent-sidebar',

		props : {

			company : { type : Object, default : ()=> {} },

			portal : { type : Object, default : ()=> {} },

			auth : { type : Object, default : ()=> {} },

			callingFrom : { type : String, default : '' },

      alertData : { type : Object, default :()=>{} },

      alertWrapper : { type : [Boolean, Number], default : '' }
		},

		components : {

			AgentNavigationBar,

			AdminNavigationBar,
		}
	};
</script>

<style type="scoped">

/*.main-sidebar{
  z-index: 9999;
}*/

.brand-image{
  max-width: 60px !important;
}

</style>