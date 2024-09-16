<template>

	<span class="timeline-actions-span">

  		<template v-if="!actions.block_ticket_actions && actions.view_tickets_without_actions">

   			<!-- labels -->
        	<ticket-label :ticketObj="data" :reloadDetails="reloadData"></ticket-label>

			<!-- tags -->
			<ticket-tag :ticketObj="data" :reloadDetails="reloadData"></ticket-tag>

     		<div id="timeline-action-div" class="inline-block">{{timelineActionDivMounted()}}</div>

   			<div id="timeline-action-bar" class="inline-block">{{timelineActionBarMounted()}}</div>

  		</template>

  		<slot name="left-actions"></slot>

  		<more-events v-if="!actions.block_ticket_actions && actions.view_tickets_without_actions" :actions="actionsList" :ticket="data" :updateDetails="reloadData">

		</more-events>
 	</span>
</template>

<script>

	import TicketLabel from "./Mini/TicketLabel.vue";
	import TicketTags from "./Mini/TicketTags.vue";
	import MoreEvents from "./Mini/MoreEvents.vue";

	export default {

  props : {

    actions : { type : [Object, String], default : '' },

    id : { type : [String, Number], default : '' },

    data : { type : Object, default : ()=> {} },

    afterAction : { type : Function, default : ()=>{} },
  },

  data() {

    return {

      actionsList : this.actions,
    }
  },

  methods : {

    reloadData(from) {

      this.afterAction(from);
    },

    timelineActionBarMounted(){

      this.data['alertName'] = 'timeline';
      // if i could pass data to it
		window.emitter.emit('timeline-action-bar-mounted', this.data);
    },

    timelineActionDivMounted(){

		this.data['alertName'] = 'timeline';
		this.data['showTaskCount'] = true;

		this.data['ticket_id'] = this.id;

		// Following two lines are added to generalize task module
		this.data['entity_id'] = this.id;
		this.data['entity_type'] = 'ticket'
		// if i could pass data to it

            window.emitter.emit('timeline-action-div-mounted', this.data);
         },
  	},

		components : {
			
			'ticket-label' : TicketLabel,
          
         'ticket-tag' : TicketTags,

         'more-events' : MoreEvents,
		}
	};
</script>


<style>

.smaller { font-size: smaller !important; }

.ticket_actions .btn { margin-bottom: 5px; font-size: 13px !important;}

.ticket_actions .btn-group .btn { margin-bottom: 5px; font-size: 13px !important; }

/*#timeline-action-bar .btn { margin-bottom: 5px; }*/

.inline-block{ display: inline-block; }

.ticket_actions { padding-top: 6px;padding-bottom: 2px; }

.br-25 { border-radius: 0.25rem; }
</style>
