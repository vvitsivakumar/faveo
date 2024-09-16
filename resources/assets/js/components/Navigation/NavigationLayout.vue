<template>
	
	<div class="sidebar" id="scroll-bar">
		
		<div class="user-panel pt-3 pb-3 mb-3 d-flex">
			
			<div class="image">

				<faveo-image-element id="sidebar-profile-img" :source-url="profilePic" :classes="['img-circle elevation-2']" 
					alternative-text="User Image"/>
        </div>

        	<div class="info">

        		<router-link class="profile_name" v-if="from == 'agent'" to="/profile">{{subString(fullName)}}</router-link>

          	<a v-else class="d-block" :title="fullName" :href="basePath()+'/panel/profile'">{{subString(fullName)}}</a>
        </div>
		</div>

		<slot></slot>
	</div>
</template>

<script>

    import { getSubStringValue } from "../../helpers/extraLogics";

    export default {

		props : {

			auth : { type : Object, default : ()=> {}},

			from : { type : String, default : '' }
		},

		computed : {
			
			sidebarStyle(){
				
				if(this.isRtlLayout){
					
					return {'margin-right': '-8px'}
				}
					
					return {'margin-left': '-8px'}
			},

			fullName(){
				
				return this.auth.user_data.full_name;
			},

        	profilePic(){
            return this.auth.user_data.profile_pic;
        	}
    	},

		methods : {

			subString(value){

				return getSubStringValue(value,20)
			},
		},
	};
</script>

<style scoped>
	.profile_name { background-color: unset !important; }

	#sidebar-profile-img { height: 2.1rem !important;}
</style>