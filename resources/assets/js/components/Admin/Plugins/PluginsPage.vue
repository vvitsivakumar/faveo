<template>
	
	<div class="col-sm-12">
	
		<alert componentName="dataTableModal"/>

		<div class="card card-light" id="plugins-list">

			<div class="card-header">
				
				<h3 class="card-title">
					{{ lang('plugins-list') }}
				</h3>        
			</div> <!--header-->

			<div class="card-body plugins_list">

				<data-table :url="apiUrl" :dataColumns="columns"  :option="options" scroll_to ="plugins-list"></data-table>    
			</div> <!--card-body-->
		</div> <!--card-->
	</div>
</template>


<script>

import SwitchHolder from "./SwitchHolder.vue";

export default {
	data() {
		return {
			apiUrl:'/getplugin',
			columns: ['activate','name', 'description', 'version'],
			options: {
        headings: {activate: this.trans('status'), name: this.trans('name'), description : this.trans('description'), action: this.trans('action'),author: this.trans('author'),version: this.trans('version')},

				columnsClasses : {

					name: 'name', 

					description: 'description', 
					
					version: 'version',

					activate: 'activate'

				},
				
				perPage:25,

				sortIcon: {
						
					base : 'glyphicon',
						
					up: 'glyphicon-chevron-up',
						
					down: 'glyphicon-chevron-down'
				},
				
				texts: { filter: '', limit: '' },

				sortable:  ['name','version'],
				
				filterable:  ['name'],
				
				pagination:{chunk:5,nav: 'fixed',edge:true},

				templates : {

                    activate: function(createElement, row) {

                        return this.h(SwitchHolder, {
                            data: row,
                        })
                    },

                    name: function(createElement, row) {

						if(row.status && row.settings) {

							return this.h('a', {

									href:  this.basePath() + '/admin/'+row.settings

							}, row.name);

						} else {

                            return row.name
						}
						
					},
				},
				
				requestAdapter(data) {
					return {
						
						'sort_field' : data.orderBy ? data.orderBy : 'status',
						
						'sort_order' : data.ascending ? 'desc' : 'asc',
						
						'search_query' : data.query.trim(),
						
						page : data.page,

						limit : data.limit,
						
					}
				},

				responseAdapter({data}) {
					return {
						
						data: data.data,
						count: data.total
					}
				},
			},
		}
	}

};
</script>

<style>

	.name,.description,.website,.version,.author{ max-width: 250px; word-break: break-word;}

	.plugins_list .VueTables .table-responsive {
		overflow-x: auto;
	}

	.plugins_list .VueTables .table-responsive > table{
		width : max-content;
		min-width : 100%;
		max-width : max-content;
		overflow: auto !important;
	}
</style>