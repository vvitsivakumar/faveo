<template>
  
  <div class="card card-light dashboard-widget-box">

		  <div class="card-header border-0">

			  <h3 class="card-title"> <i class="fas fa-list-ul"></i> {{lang('todo')}}</h3>

        <div v-if="loading" class="card-tools">

          <button type="button" class="btn btn-tool rotating" data-card-widget="refresh" v-tooltip="lang('refresh')">

            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
		  </div>

		  <!-- Show todo list if list is not empty -->
		  <div class="card-body">

			  <div class="row">
				  <div :class="editMode ? 'col-md-9' : 'col-md-12'">
					  <input class="form-control" ref="todoInput" autocomplete="off" :placeholder="lang('todo_placeholder')" autofocus
							 v-model.trim="newTodoText" @keyup.enter="editMode ? editTodoName() : addNewTodo()">
				  </div>
				  <div class="col-md-3">
					  <button v-if="editMode" type="button" class="btn btn-default pull-right todo_edit_btn" v-tooltip="lang('cancel_editing')"
							  @click="cancelEditMode"><i class="fas fa-times"></i>&nbsp;{{lang('cancel')}}</button>
				  </div>
			  </div>

			  <!-- Show quote message if todo list is empty  -->
			  <div class="no-todo-section" v-if="todoList.length === 0">
				  <blockquote>&quot; {{lang('todo_quote')}} &quot;</blockquote>
			  </div>

			  <div class="scrollable-area mt-2" v-else>
				  <draggable-element class="list-group" tag="ul" :list="todoList" @end="onReorder" itemKey="id">

					  <template #item="{element, index}" :key="element.id">

						  <li class="list-group-item todo_item">

							  <div class="row">
								  <div class="col-sm-9">
									  <!-- Todo marker -->
									  <span class="todo-mark" v-if="element.is_private" v-tooltip="trans('private_task')"><i class="fas fa-lock fa-lg" aria-hidden="true" style="color:grey"></i>&nbsp;</span>
									  <span class="todo-mark" v-show="['pending', 'Open'].includes(element.status)" @click="onTodoMarkClick(index)" v-tooltip="getTodoMarkerTitle(element.status)"><i class="far fa-clock fa-lg" aria-hidden="true" style="color:red"></i></span>
									  <span class="todo-mark" v-show="['in-progress', 'In-progress'].includes(element.status)" @click="onTodoMarkClick(index)" v-tooltip="getTodoMarkerTitle(element.status)"><i class="fas fa-check-circle fa-lg" aria-hidden="true" style="color:orange"></i></span>
									  <span class="todo-mark" v-show="['completed', 'Closed'].includes(element.status)" @click="onTodoMarkClick(index)" v-tooltip="getTodoMarkerTitle(element.status)"><i class="fas fa-check-circle fa-lg" aria-hidden="true" style="color:green"></i></span>

									  <!-- Todo name -->
									  <span class="text todo-text" :style="['completed', 'Closed'].includes(element.status) ? {'text-decoration': 'line-through'} : {}">{{element.name}}</span>

									  <!-- Todo status -->
									  <span class="badge badge-danger text-lowercase ml-1" v-show="['pending', 'Open'].includes(element.status)">{{lang(element.status)}}</span>
									  <span class="badge badge-info text-lowercase ml-1" v-show="['in-progress', 'In-progress'].includes(element.status)">{{lang(element.status)}}</span>
									  <span class="badge badge-success text-lowercase ml-1" v-show="['completed', 'Closed'].includes(element.status)">{{lang(element.status)}}</span>
								  </div>

								  <!-- Todo actions -->
								  <div class="todo-tools col-sm-3 text-right">
									  <i class="fas fa-trash" @click="deleteTodo(element.id, index)" style="cursor:pointer; color:red;"
										 v-tooltip="lang('remove')" aria-hidden="true"></i>&nbsp;
									  <i class="fas fa-pencil-alt" @click="onEditTodo(index)" style="cursor:pointer" v-tooltip="lang('edit')"
										 aria-hidden="true">

									  </i>
								  </div>
							  </div>
						  </li>
					  </template>
				  </draggable-element>
				  <infinite-loading @infinite="getTodoList" ref="infiniteLoading">
					  <template #spinner><span></span></template>
					  <template #complete><span></span></template>
				  </infinite-loading>
			  </div>
		  </div>
  </div>
  <delete-modal v-if="showModal" :onClose="onClose"  :showModal="showModal"  :deleteUrl="deleteUrl"  alertComponentName="dashboard-page"></delete-modal>
</template>

<script>

import axios from 'axios';
import draggable from 'vuedraggable'
import {errorHandler, successHandler } from "../../../../helpers/responseHandler";
import deleteModal from "../../../MiniComponent/DataTableComponents/DeleteModal.vue";

export default {

    name : 'dashboard-todo',

		data: () => {
			return {
        todoList: [],
        newTodoText: '',
        editMode: false,
        editTodoIndex: undefined,
        page: 1,
				loading :false,
        showModal :false,
        deleteUrl:''
      }
		},

		beforeMount() {
			this.getTodoList();
    },

  created() {
    window.emitter.on('taskUpdated', () => {
       this.getTodoList(null, 'success', true);
      });
  },

  methods: {

			getTodoList($state, successResponse, calledAfterUpdate = false) {
        if (calledAfterUpdate) {
          this.page = 1;
          this.todoList = [];
        }

        this.loading = true;

				axios.get('api/agent/todo-list?page=' + this.page)
        .then(response => {
          if(successResponse) {
            successHandler(successResponse, 'dashboard-page');
            this.loading = false;
          }
          if (response.data.data.data.length) {
            this.page++;
            this.todoList = [...this.todoList, ...response.data.data.data];
			if($state){$state.loaded()};
            this.loading = false;

          } else {
			  if($state){$state.complete()};
            this.loading = false;
          }
        })
        .catch(error => {
          errorHandler(error, 'dashboard-page');
          this.loading = false;
				})
				.finally(() => {
                    setTimeout(()=>{

                        this.$refs.todoInput.focus();
                    },1)
				})
      },

      editTodoName() {
        if(typeof this.editTodoIndex !== 'undefined') {
          let clonedTodoList = JSON.parse(JSON.stringify(this.todoList));
          clonedTodoList[this.editTodoIndex].name = this.newTodoText;
          this.updateTodo(clonedTodoList).then(response => {
            successHandler(response, 'dashboard-page');
            this.todoList[this.editTodoIndex].name = this.newTodoText;
            this.newTodoText = '';
            this.editMode = false;
            this.loading = false;
          })
          .catch(err => {
            this.loading = false;
            errorHandler(err, 'dashboard-page');
          })
        }
      },

      onTodoMarkClick(index) {
        this.todoList[index].status = this.getNextState(this.todoList[index].status);
        this.updateTodo(this.todoList).then(response => {
          successHandler(response, 'dashboard-page');
          this.loading = false;
        })
        .catch(err => {
          errorHandler(err, 'dashboard-page');
          this.loading = false;
        })
      },

      getTodoMarkerTitle(currentState) {
        return this.trans('click_to_change_status') + `${this.trans(this.getNextState(currentState))}`;
      },

      getNextState(currentState) {
        const nextStateObj = {
          pending: 'in-progress',
          'in-progress': 'completed',
          completed: 'pending',
          Open: 'In-progress',
          'In-progress': 'Closed',
          Closed: 'Open'
        };

        return nextStateObj[currentState]
      },

      onReorder() {
        this.updateTodo(this.todoList).then(response => {
          successHandler(response, 'dashboard-page');
          this.loading = false;
        })
        .catch(err => {
          errorHandler(err, 'dashboard-page');
          this.loading = false;
        })
      },

      addNewTodo() {
        axios.post('api/agent/create-todo', { name: this.newTodoText })
        .then(response => {
          this.newTodoText = '';
          this.getTodoList(null, response ,true);
        })
        .catch(error => {
          errorHandler(error, 'dashboard-page');
        })
      },

      deleteTodo(id) {
        this.deleteUrl = 'api/agent/todo/' + id
        this.showModal = true
      },

      onClose(){

        this.showDeleteModal = false;

        this.showAssociateModal = false;

        this.showModal = false
    },

      updateTodo(newTodoList) {
        this.loading = true;
        return axios.post('api/agent/update-todos', { todos : newTodoList })
        this.loading = false;
      },

      onEditTodo(index) {
        this.editMode = true;
        this.editTodoIndex = index;
        this.newTodoText = this.todoList[index].name;
          this.$refs.todoInput.focus();
      },

      cancelEditMode() {
        this.editMode = false;
        this.newTodoText = '';
        this.editTodoIndex = undefined;
      }
		},

		components: {
      'delete-modal': deleteModal,
      'draggable-element': draggable
		}
	};
</script>

<style type="text/css" scoped>
.scrollable-area {
  height: 80% !important;
  overflow-y: auto;
}
.todo-tools {
  display: none;
}
.list-group-item {
  cursor: move;
}
.list-group-item:hover .todo-tools {
  display: block;
}
.todo-text {
  padding-left: 7px
}
.todo-mark {
  cursor: pointer;
}
.todo_edit_btn { font-size: 12px !important;padding: 8px; }

.todo_item { border-bottom: 2px solid #dfdfdf; }

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Apply the rotation animation when the button has a class of "rotating" */
.btn-tool.rotating i {
  animation: rotate 2s linear infinite; /* Adjust the duration and animation properties as needed */
}
</style>