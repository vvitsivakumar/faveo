<template>
	
	<div class="card card-light">

		<div class="card-header pad-7">
			
			<h3 class="card-title">

				<img class="img-circle img-bordered-sm" :src="user.profile_pic" alt="user image" style="width: 30px;height: 30px;">&nbsp;{{user.full_name}}
			</h3>	
		</div>
						
		<div class="card-body box-profile">

			<ul class="list-group list-group-unbordered mb-3">
				
				<li class="list-group-item">
					
					<label>{{trans('role')}}</label> <a class="float-right">{{user.role}}</a>
				</li>

				<li class="list-group-item">
					
					<label>{{trans('email')}}</label> <a class="float-right" v-tooltip="user.email">{{subString(user.email,30)}}</a>
				</li>
				
				<li class="list-group-item">
					
					<label>{{trans('mobile')}}</label> <a class="float-right">{{user.mobile}}</a>
				</li>

				<li v-if="boolean(org)" class="list-group-item">

              	<label>{{ trans('organization') }}</label>
           		
           		<ul>
           		
           			<li v-for="organization in org">
           		
           				<router-link v-tooltip="organization.name" :to="organization.href.replace(basePath(),'')">
           					{{subString(organization.name,30)}}
           				</router-link>
           			</li>
           		</ul>
            </li>
			</ul>

			<router-link v-if="!archive" :to="'/user/'+user.id" class="btn btn-primary btn-block">
				<i class="fas fa-info-circle"> </i> {{trans('view_more_info')}}
			</router-link>

      <a v-else :href="showUserProfile(user.id)" target="_blank" class="btn btn-primary btn-block">
        <i class="fas fa-info-circle"> </i> {{trans('view_more_info')}}
      </a>
		</div>
	</div>
</template>

<script>
	
	import { getSubStringValue } from "../../../../../../helpers/extraLogics";

	export default {

		name : 'timeline-requester',

		props : {

			user : { type : Object, default : () => {}},

			org : { type : Array, default : () => []},

      archive : { type : Boolean , default : false},
		},

		methods :{

			subString(value,length = 15){
	 
			  return getSubStringValue(value,length)
			},

      showUserProfile(id){

        return this.basePath()+'/panel/user/'+id;
      }
		}
	};
</script>

<style scoped>
	.pad-7 { padding: 7px !important; }
</style>