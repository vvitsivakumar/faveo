<template>
  <div v-for="(item, index) in alertContent" :key="index">

    <div ref="alertWrapperElements" v-if="item.use === 1" class="alert-warning alert-wrapper mb-0 pt-2 pl-3 pb-1"
         :style="{ top: item.topPosition + 'px' ,backgroundColor: getAlertBackgroundColor(index),
         zIndex: index === alertContent.length - 1 ? 9999 : 99999999}">

      <button type="button" @click="onCloseAlert(item)" class="close pt-2  pr-4 pr-3" id="alert_close">×</button>

      <div class="row">

        <div class="col-sm-12 alert-description">

          <div class="col-sm-10">

            <template v-if="auth.user_data.role == 'admin'">

              <span style="vertical-align: 1px;"> <i class="fas fa-warning"></i></span>
              <span v-html="item.description"></span>&nbsp;
              <a class="update-conent" v-if="item.pop_name === 'update' && item.link" :href="item.link+'admin/check-updates'">
                <b>{{trans('click-here-to-update')}}</b>
                </a>
              <a class="update-conent" v-if="item.pop_name === 'renew' && item.link" :href="item.link">
                <b>{{trans('click-here-to-renew')}}</b>
              </a>
            </template>

            <template v-else>

              <span v-html="item.description"></span>
            </template>
          </div>

          <div class="remind-select float-right">

            <label class="remind-option">{{'Remind me after : '}}</label>&nbsp;

            <div class="btn-group">

              <button type="button" class="dropdown-toggle select-button alert-warning btn btn-outline"
                      :style="{backgroundColor: getAlertBackgroundColor(index)}" style="margin-right: 0px !important;"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                {{item.selectedOption }}
              </button>

              <div class="dropdown-menu option-container">

                <div
                    class="dropdown-item option-select"
                    @click="updateSelectedOption(item,'1 Day')"
                    :class="{ alertDay: item.selectedOption === '1 Day' }"
                >1 Day</div>

                <div
                    class="dropdown-item option-select"
                    @click="updateSelectedOption(item,'3 Days')"
                    :class="{ alertDay: item.selectedOption === '3 Days' }"
                >3 Days</div>

                <div
                    class="dropdown-item option-select"
                    @click="updateSelectedOption(item,'7 Days')"
                    :class="{ alertDay: item.selectedOption === '7 Days' }"
                >7 Days</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

	<div class="wrapper" v-bind:style="{ top: alertContent ? this.alertWrapper +'px !important' : '' }">

		<admin-nav-bar  v-bind:style="{ top: alertContent ? this.alertWrapper +'px !important' : '' }" :auth="auth" :portal="portal" callingFrom="admin"></admin-nav-bar>

		<admin-side-bar  v-bind:style="{ top: alertContent ? this.alertWrapper +'px !important' : '' }" :auth="auth" :alertWrapper="alertWrapper" :alertData="alertContent" :company="company" :portal="portal" callingFrom="admin"></admin-side-bar>

		<div class="content-wrapper">

			<admin-bread-crumbs></admin-bread-crumbs>

			<div class="content">

				<div class="container-fluid">

					<alert componentName="layout"></alert>

					<div  v-if="dummyInstall" class="alert alert-info alert-dismissible">

						<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>

						<i class="fas fa-warning"></i>&nbsp;

						<template v-if="auth.user_data.role == 'admin'">

							{{trans('dummy_data_installation_message')}}&nbsp;<router-link to="/clean-dummy-data">{{trans('click')}}&nbsp;</router-link>{{trans('clear-dummy-data')}}
						</template>

						<template v-else>{{trans('clear-dummy-data-agent-message')}}</template>

					</div>

					<div v-if="!dummyInstall && !mail_config" class="alert alert-warning">

						<i class="fas fa-warning"></i>&nbsp;

						<template v-if="auth.user_data.role == 'admin'">
							{{trans('system-outgoing-incoming-mail-not-configured')}}
							<router-link to="/email/create">{{trans('confihure-the-mail-now')}}</router-link>
						</template>

						<template v-else> {{trans('system-mail-not-configured-agent-message')}}</template>
					</div>


            <div v-if="!dummyInstall && (searchCron || isAnyMigration)" class="alert alert-warning">&nbsp;
                <i class="fas fa-spinner"></i>&nbsp;
                {{isAnyMigration ? trans('module-migration') : trans('search-cron-running')}}
            </div>

					<div class="row">

                        <router-view v-slot="{ Component }">

                            <transition name="fade" mode="out-in">

                                <component :is="Component" :key="$route.fullPath" :auth="auth" :dummyInstall="dummyInstall" :whiteLabel="whiteLabel"/>
                            </transition>
                        </router-view>
            
            <vue-progress-bar class="color-shift-progress-bar"></vue-progress-bar>
<!--						<transition name="fade" mode="out-in">-->

<!--							<router-view :key="$route.fullPath" :auth="auth" :dummyInstall="dummyInstall" :whiteLabel="whiteLabel"></router-view>-->
<!--						</transition>-->
					</div>
				</div>
			</div>
		</div>

		<admin-footer :company="company" :whiteLabel="whiteLabel" :tag="tag" :version="version" :lang="auth.user_data.user_language"></admin-footer>

		<help-widget v-if="!whiteLabel"></help-widget>

		<div id="monitoring-system-status">{{ layoutLoaded() }}</div>
	</div>
</template>

<script>

import AdminNavBar from '../Agent/LayoutComponents/AgentNavbar.vue';
import AdminSideBar from '../Agent/LayoutComponents/AgentSidebar.vue';
import AdminFooter from '../Agent/LayoutComponents/AgentFooter.vue';
import AdminBreadCrumbs from '../Agent/LayoutComponents/AgentBreadcrumbs.vue';
import HelpWidget from "../HelpSection/HelpSection.vue";

export default {

	name : 'admin-panel-layout',

	props : {

		auth : { type : Object, default : ()=> {} },

		company : { type : Object, default : ()=> {} },

		portal : { type : Object, default : ()=> {} },

		whiteLabel : { type : Boolean, default : false },

		tag : { type : String , default : ''},

		version : { type : String , default : ''},

		isMailConfigured : { type : Boolean, default : true },

		dummyInstall : { type : Boolean, default : false },

    isUpdatedVersion : { type : [Boolean, String, Number], default : false }
	},

	data() {

		return {

			mail_config : this.isMailConfigured,

      selectedOption: "1 Day",

      alertWrapper: 0,

      alertData:'',

      alertContent: '',

      searchCron: false,

      isAnyMigration: false
		}
	},

  beforeMount() {

    this.checkForUpdate();

    this.checkSearchCronCommand();
  },

  updated() {
    // This hook is called whenever the component's DOM is updated.
    // We can access the updated element and log its height.
    this.logAlertWrapperHeight();
  },
  mounted() {
    // This hook is called when the component is mounted in the DOM.
    // We can log the initial height here if needed.
    this.logAlertWrapperHeight();

    // Add the resize event listener
    window.addEventListener('resize', this.onWindowResize);
  },
  beforeDestroy() {
    // Remove the resize event listener when the component is destroyed
    window.removeEventListener('resize', this.onWindowResize);
  },

	created() {
		window.emitter.on('checkMailConfig',this.checkConfig);
	},

	methods : {

    getAlertBackgroundColor(index) {
      const baseColor = "#ffc107"; // Initial color
      const step = 10; // Color step (adjust to your preference)

      // Calculate the new color based on the index
      const r = parseInt(baseColor.slice(1, 3), 16) + index * step;
      const g = parseInt(baseColor.slice(3, 5), 16) + index * step;
      const b = parseInt(baseColor.slice(5, 7), 16) + index * step;

      // Ensure that RGB values stay within the valid range (0-255)
      const clamp = (value) => Math.min(255, Math.max(0, value));

      return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`;
    },

    async checkForUpdate() {
      try {
        // Fetch alert data
        const alertResponse = await axios.post('/display-pop-ups');
        this.alertData = alertResponse.data.map(item => ({
          ...item,
          selectedOption: "1 Day",
          topPosition: 0
        }));

        // Fetch and update descriptions
        const decryptedDescriptions = [];
        for (const item of this.alertData) {
          try {
            const data = { value: item.description };
            const res = await axios.post('/give-me-read', data);
            decryptedDescriptions.push(res.data);
          } catch (error) {
            console.log(error);
            decryptedDescriptions.push('');
          }
        }

        // Update the description field with the decrypted values
        this.alertData.forEach((item, index) => {
          item.description = decryptedDescriptions[index];
        });

        // Fetch days data
        const daysResponse = await axios.get('/get-days');
        const responseData = daysResponse.data.data;
        for (const item of this.alertData) {
          const itemId = item.id.toString();
          if (responseData.hasOwnProperty(itemId)) {
            const days = responseData[itemId];
            item.selectedOption = days === 1 ? "1 Day" : `${days} Days`;
          }
        }

        this.alertContent = this.alertData;

        // Log the alert wrapper height
        await this.logAlertWrapperHeight();

      } catch (error) {
        console.log(error);
      }
    },

    onCloseAlert(item){

      if (!Array.isArray(this.alertContent)) {
        this.alertContent = [];
      }

      const currentIndex = this.alertContent.findIndex(alert => alert.id === item.id);

      if (currentIndex > -1) {

        this.alertContent.splice(currentIndex, 1); // Remove the closed alert
      }

      const data = {};

      data['pop_id'] = item.id;

      let days = parseInt(item.selectedOption.match(/\d+/)[0], 10);

      data['days'] = days = '' ? 1: days;

      data['user_id'] = this.auth.user_data.id;

      axios.post('/post-days', data).then((res) => {

          this.checkForUpdate();
      }).catch((error) => {
        console.log(error);
      });
    },

		checkConfig(value) {

			if(value) { this.mail_config = true }
		},

		layoutLoaded() {

			window.emitter.emit('layout-loaded');
		},

    logAlertWrapperHeight() {

      this.$nextTick(() => {
        // Get an array of elements with the ref 'alertWrapper'
        const alertWrapperContainers = this.$refs.alertWrapperElements;

        if (alertWrapperContainers) {
          // Initialize a variable to store the total height
          let totalHeight = 0;

          // Iterate through each element and calculate the client height
          alertWrapperContainers.forEach((element, index) => {
            if (element) {
              const clientHeight = element.clientHeight;

              totalHeight += clientHeight;

              // Calculate the top position for the current alert
              const topPosition = totalHeight - clientHeight;
              this.alertData[index].topPosition = topPosition;
            }
          });

          // Assign the total height to the alertWrapper
          this.alertWrapper = totalHeight;
        }
      });
    },

    onWindowResize() {
      // Handle the resize event here
      // You can log the updated height again or perform any other actions
      this.logAlertWrapperHeight();
    },

    updateSelectedOption(item, option) {
      item.selectedOption = option;
    },

    checkSearchCronCommand() {
        axios.get('check/search-cron').then(res => {

            this.searchCron = res.data.data.cron_status;
            this.isAnyMigration = res.data.data.is_any_migration;
        }).catch(err => {
            this.searchCron = false;
            this.isAnyMigration = false;
        })
    }
	},

	components : {

		AdminNavBar,

		AdminBreadCrumbs,

		HelpWidget,

		AdminFooter,

		AdminSideBar,
	}
};
</script>

<style scoped>

	.fade-enter {
		opacity: 0;
	}

	.fade-enter-active {
		transition: opacity 0.2s ease;
	}

	.fade-leave {}

	.fade-leave-active {
		transition: opacity 0.2s ease;
		opacity: 0;
	}

  .option-select:hover{
    background-color: #ffd140 !important;
    cursor: pointer !important;
    color: #1f2d3d !important;
  }

  .option-select{
    padding: 0 2px 0 12px !important;
  }

  .select-button .btn:focus {
    box-shadow: none;
    background-color: transparent;
  }

  select-button{
    border-color: #63727e;
  }

  .option-container{
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    padding: 0 !important;
    border-color: #63727e!important;
  }

  .dropdown-item.alertDay {
    background-color: #ffd140 !important;
    color: #1f2d3d !important;
  }

  .alert-wrapper{
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
  }

  .remind-option{
    font-weight: 500 !important;
  }

  .update-conent{
    font-size: 18px !important;
  }

  .alert-description {
    display: flex;
    justify-content: right;
    align-items: center;
    height: 100%;
    text-align: center;
  }

  .color-shift-progress-bar {
    width: 100%;
    height: 5px;
    background: linear-gradient(90deg, transparent 0, #00e1ff 200px, transparent 0);
    background-size: 200% 10px;
    animation: color-move-animation 2s linear infinite;
  }

  @keyframes color-move-animation {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }

  #alert_close{
    padding-left: 5px !important;
  }
</style>
