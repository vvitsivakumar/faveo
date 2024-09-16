<template>

	<transition name="page" mode="out-in">

		<div :class="{login_align : layout.language === 'ar'}">
			
			<meta-component :dynamic_title="lang('auth-login-title')" :dynamic_description="lang('auth-login-description')" 
				:layout="layout" >
				
			</meta-component>

			<div id="content" class="site-content col-md-12 ng-scope">
				
				<alert componentName="page-login"/>

				<widget-component :layout="layout" :auth="auth"></widget-component>
				<custom-loader v-if="isLoading"/>
				<template v-else>
					
					<login slot="fields" :layout="layout" :auth="auth"></login>
				</template>
			</div>
		</div>
	</transition>
</template>
<script>

	import axios from 'axios'

    import { errorHandler, successHandler } from "../../../../helpers/responseHandler"

    import WidgetBoxComponent from "../../ClientPanelLayoutComponents/WidgetBoxComponent.vue";
    import LoginComponent from "./MiniComponents/LoginComponent.vue";

	export default {

		name : 'login-page',

		description : 'Login page component',

		props : {

			layout : { type : Object, default : ()=>{}},

			auth : { type : Object, default : ()=>{}}
		},
		data: () => {
			return {
				isLoading: false,
			}
		},
		beforeMount(){

			if(this.$route.query && this.$route.query.error){
        
		       this.$store.dispatch('setAlert',{type:'danger',message:this.$route.query.error, component_name : 'page-login'});

		       setTimeout(()=>{

		       	this.$router.replace({name:'Login'})
		       },5000)
		     } 
			if(!Array.isArray(this.auth.user_data)){
				this.$router.push({name:'Home'})
			}
			const CURRENT_ROUTE = this.$router.currentRoute.value;

			if (CURRENT_ROUTE && CURRENT_ROUTE.name === 'SocialCallback') {
				this.isLoading = true;
				this.handleSocialCallback(CURRENT_ROUTE)
			}
		},
		methods: {
			handleSocialCallback(currentRoute) {
				axios.get(`api${currentRoute.fullPath}`)
					.then((res)=> {

						successHandler(res, 'page-login')

						let redirectUrl = localStorage.getItem('redirectPath')

						if(redirectUrl) {
							window.location.href = this.base + redirectUrl
						}

						redirectUrl = res.data.data.redirect_url
						
						//Ganda hai par dhandha hai ye
						if (redirectUrl != "/") {
							redirectUrl = "/"+redirectUrl;
						}

            if(redirectUrl == '/verify-2fa'){
              this.$Progress.finish();
              this.$router.push({ path:'/verify-2fa',name: 'Verify2FA', params : { pp:JSON.stringify(res.data.data.PPAuth), remember : true}});
            }
            else {
              this.redirect(redirectUrl);
            }
						window.emitter.emit('login-success', res)

					})
					.catch((err) => {
						errorHandler(err, 'page-login')
						this.isLoading = false
					})
			}
		},
		components:{
			
			'widget-component': WidgetBoxComponent,

			'login' : LoginComponent
		},
	};
</script>

<style scoped>

	.login_align{
		direction: rtl;
	}
</style>