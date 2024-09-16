<template>

	<div class="col-sm-12">

		<div class="row" v-if="!hasDataPopulated || loading">

			<custom-loader :duration="4000"></custom-loader>
		</div>

		<alert componentName="tag-create-edit"/>

		<faveo-box v-if="hasDataPopulated" :title="trans(page_title)">

			<div class="row" v-focus-first-input>

				<text-field :label="trans('name')" :value="name"
					type="text"
					name="name"
					:onChange="onChange" :placehold="lang('enter_a_value')"
                    :keyupListener="triggerEvent"
					classname="col-sm-6"
					:required="true"
					>
				</text-field>

				<dynamic-select :label="trans('visibility')" :multiple="true"
					:elements="visibility_options" name="visible_to" :value="visible_to"
					classname="col-sm-6" :onChange="onChange" :required="true">
				</dynamic-select>
			</div>

			<div class="row">

				<text-field :label="trans('description')" :value="description"
					type="textarea"
					name="description"
					:onChange="onChange" :placehold="lang('enter_a_value')"
                    :keyupListener="triggerEvent"
					classname="col-sm-12"
					:required="false"
					>
				</text-field>
			</div>

            <template #actions>

                <div class="card-footer">

                    <button id="submit_btn" class="btn btn-primary" @click="onSubmit()">

                        <i :class="iconClass"></i> {{trans(btnName)}}
                    </button>
                </div>
            </template>
		</faveo-box>
	</div>
</template>

<script>

	import axios from 'axios'

	import {successHandler, errorHandler} from "../../../../helpers/responseHandler";

	import  { getIdFromUrl } from '../../../../helpers/extraLogics';
	
	import { validateTagSettings } from "../../../../helpers/validator/tagValidation.js";
    import TextField from "../../../MiniComponent/FormField/TextField.vue";
    import DynamicSelect from "../../../MiniComponent/FormField/DynamicSelect.vue";

	export default {

		name : 'tag-create-edit',

		description  : 'Tag Create edit page',

		data(){

			return {

				page_title : 'create_tag',

				iconClass : 'fas fa-save',

				btnName : 'save',

				hasDataPopulated : false,

				loading : false,

				// essentials
				tag_id : '',

				name : '',

			  	description : '',

			  	visibility_options:[{ id:"all_users",name:"All Users" },{ id:"logged_in_users",name:"Logged in Users" },{ id:"agents",name:"Agents" }],

				visible_to: "",
			}
		},

		beforeMount(){

			const path = window.location.pathname

			this.getValues(path);
		},

		methods : {

			getValues(path){

				const tagId = getIdFromUrl(path)

				if(path.indexOf('edit') >= 0){

					this.page_title = 'edit_tag'

					this.iconClass = 'fas fa-sync'

					this.btnName = 'update'

					this.hasDataPopulated = false

					this.getInitialValues(tagId)

				} else {

					this.loading = false;

					this.hasDataPopulated = true;
				}
			},

			getInitialValues(id){

				this.loading = true

				axios.get('/api/tag/'+id).then(res=>{

					this.loading = false;

					this.hasDataPopulated = true

					let tagData = res.data.data.tag;

					this.tag_id = tagData.id;

					this.updateStatesWithData(tagData)

				}).catch(error=>{

					this.loading = false;

					errorHandler(error,'tag-create-edit')
				});
			},

			updateStatesWithData(data){

				const self = this;

				const stateData = this.$data;

				Object.keys(data).map(key => {

					if (stateData.hasOwnProperty(key)) {

						self[key] = data[key];
					}
				});

				let arr = this.visible_to.split(',');

				this.visible_to = this.visibility_options.filter(obj => arr.includes(obj.id)).map(obj => obj);
			},

			isValid(){

				const { errors, isValid } = validateTagSettings(this.$data);

				return isValid;
			},

			onChange(value, name) {

				this[name] = value;
			},

			onSubmit(){

				if(this.isValid()){

					this.loading = true

					let data = {};

					data['name'] = this.name;

					data['description'] = this.description;

					data['visible_to'] = this.visible_to.map(a => a.id);

					let apiUrl =  '/api/tag';

					if(this.page_title == 'edit_tag') {

						apiUrl = '/api/tag/update/'+this.tag_id;

						data['_method'] = 'PATCH'
					}

					axios.post(apiUrl, data).then(res => {

						this.loading = false

						successHandler(res,'tag-create-edit')

						if(!this.tag_id){

							setTimeout(()=>{
								this.$router.push({ name : 'Tags Index'});
							},3000);

						} else {

							this.getInitialValues(this.tag_id)
						}
					}).catch(err => {

						this.loading = false

						errorHandler(err,'tag-create-edit')
					});
				}
			},
      triggerEvent(event) {
        var key = event.which || event.keyCode;
        if (key === 13) { // 13 is enter
          this.onSubmit();
        }
      },
		},
		components  : {

			'text-field': TextField,

			'dynamic-select': DynamicSelect
		}
	};
</script>
