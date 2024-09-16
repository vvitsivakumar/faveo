<template>

	<li v-if="!navigation.hasChildren" class="nav-item">
	
		<template v-if="navigation.routeString != 'panel/dashboard' && navigation.routeString != 'admin/home' && navigation.routeString != 'client/home' && navigation.routeString != 'auth/logout' && navigation.routeString != 'horizon' && navigation.routeString != '__clockwork/app'">
			
			<a v-if="navigation.open_new_tab" :class="['nav-link',{'active active-navigation-element' : active}]"
			             :href="basePath()+'/admin'+getLink(navigation)" @click="onNavigationClick(navigation)">
				
				<i :class="'nav-icon '+navigation.iconClass"></i>
				
				<p v-tooltip="tooltipContent"> {{(navigation.hasCount) ? subStr(navigation.name,16) :  subStr(navigation.name,20)}}
					
					<span v-if="boolean(navigation.hasCount)" class="right badge badge-success" id="nav_count">

                        {{navigation.count}}
				    </span>
				</p>
			</a>
			
			<router-link v-else :class="['nav-link',{'active-navigation-element active' : active}]"
			             :to="getLink(navigation)" @click.native="onNavigationClick(navigation)">

				<i :class="'nav-icon '+navigation.iconClass"></i>

				<p v-tooltip="tooltipContent"> {{(navigation.hasCount) ? subStr(navigation.name,16) :  subStr(navigation.name,22)}}

					<span v-if="boolean(navigation.hasCount)" class="right badge badge-success" id="nav_count">

                        {{navigation.count}}
				    </span>
				</p>
			</router-link>
		</template>
		
		<a v-else :class="['nav-link',{'active active-navigation-element' : active}]"
			:href="getLink(navigation)" @click="onNavigationClick(navigation)">

			<i :class="'nav-icon '+navigation.iconClass"></i>

			<p v-tooltip="tooltipContent"> {{(navigation.hasCount) ? subStr(navigation.name,16) :  subStr(navigation.name,22)}}

				<span v-if="boolean(navigation.hasCount)" class="right badge badge-success" id="nav_count">

                    {{navigation.count}}
				</span>
			</p>
		</a>
	</li>

	<li v-else :class="['nav-item has-treeview',{'menu-open' : menuOpened}]">

		<a href="javascript:;" :class="['nav-link',{'active' : active}]" id="nav_child" v-on:click.stop="onNavigationClick(navigation)">

			<i :class="'nav-icon '+navigation.iconClass"></i>

			<p v-tooltip="tooltipContent">{{navigation.name.length > 22 ? subStr(navigation.name,22) : navigation.name}}

				<i class="right fas fa-angle-left"></i>
			</p>
		</a>

		<ul class="nav nav-treeview" :class="[{'displayMenu' : menuOpened, 'hideMenu' : !menuOpened}]">

			<navigation v-for="(nav, index) in navigation.children" :navigation="nav" :key="index"
				:toggleParent="toggleActive" :from="from">

			</navigation>
		</ul>
	</li>
</template>

<script>

import axios from "axios";

import { boolean, getSubStringValue } from "../../helpers/extraLogics";

export default {

	name : 'navigation',

	props:{

		navigation : { type : Object, default :()=>{}},

		toggleParent : {type : Function, default : ()=>{} },

		from : { type : String, default : '' }
	},

	data(){

		return {

			menuOpened : false,

			active : false,
		}
	},

	mounted(){

    	this.markNavigationActiveIfRequired()
  	},

	methods : {

		/**
     	* Marks active and menuOpened as true.
     	* NOTE: this method is passed to children so that chilren can call this method and mark parent as active
     	* @return {undefined}
     	*/
    	toggleActive(){

      	this.active = true;

      	this.menuOpened = true;

      	this.toggleParent();
    	},

		isActive(navigation){

			if(this.getCurrentRouteUrl() == navigation.redirectUrl ){

				return true
			}
		},

		/**
		 * Redirects if has no child elements
		 * @param  {String} redirectUrl
		 * @return {String}
		 */
		onNavigationClick(navigation){

      if(navigation.redirectUrl && navigation.redirectUrl.includes('tickets?show')){

        window.emitter.emit('refreshTicketPage');
      }

			this.active = navigation.redirectUrl ? false : this.active;

			this.markNavigationActiveIfRequired();

			// for logout
			if(navigation.routeString == 'auth/logout'){

				axios.post('/auth/logout').then(res=>{

					 window.location.replace(res.data.data);

				}).catch(error=>{})
			}

		 // if hasChildren is false, then redirect
      	if(boolean(navigation.hasChildren)){

        		this.menuOpened = !this.menuOpened;
      	}
		},

		 /**
	     * Gets redirect link for the anchor tag
	     * @return {String}
	     */
	    getLink(navigation){

	      if(!boolean(navigation.hasChildren)){

			if(navigation.routeString == 'panel/dashboard' || navigation.routeString == 'admin/home' || navigation.routeString == 'client/home' || navigation.routeString == 'auth/logout' || navigation.routeString == 'horizon' || navigation.routeString == '__clockwork/app') {

				return navigation.redirectUrl;

			} else {

				return navigation.redirectUrl.replace(this.basePath(), '');

			}
	      }
	      return 'javascript:void(0);';
	    },

		/**
		 * Gets current url
		 * @return {String}
		 */
		getCurrentRouteUrl(){
			return window.location.href;
		},


		subStr(name,count) {
			return getSubStringValue(name,parseInt(count));
		},

		/**
	     * Checks if navigation is active, if yes mark that as active
	     * @return {undefined}
	   */
    	markNavigationActiveIfRequired(){
      	
      	if(this.getCurrentRouteUrl().replace('/panel','') == this.navigation.redirectUrl || this.getCurrentRouteUrl().replace('/admin','') == this.navigation.redirectUrl){

        		this.active = true;

        		this.toggleParent();
      	}
    	},
	},

	watch : {

    	active(newVal){

      	if(newVal){
        	// waiting for the DOM to render completely so that active-navigation-element can be present
        		setTimeout(()=>{

          		let activeElements = document.getElementsByClassName('exact-active');

          		if(activeElements !== undefined && activeElements.length){

            		activeElements[activeElements.length - 1].scrollIntoView({behavior: "smooth", block: 'end'});

          		} else {

          			let exactElements = document.getElementsByClassName('active-navigation-element');

				       if(exactElements !== undefined){

				         exactElements[exactElements.length - 1].scrollIntoView({behavior: "smooth"});
				       }
          		}
        		},10)
      	}

      	return newVal;
    	}
  	},

  computed: {
    tooltipContent() {
      if ((this.navigation.hasCount && this.navigation.name.length > 16) || (!this.navigation.hasCount && this.navigation.name.length > 22)) {
        return this.navigation.name;
      }
      return '';
    }
  }
};
</script>

<style scoped>

	.displayMenu { display : block !important; }

	.hideMenu { display : none !important; }
</style>
