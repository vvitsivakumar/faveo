<template>
	
	<li class="comment">
				
		<article v-if="!loading" class="comment-body" :class="{bod1: lang_locale == 'ar'}">
					
			<footer class="comment-meta" :class="{meta: lang_locale == 'ar'}"
				:style="[comments.user.role !== 'user' ? {'background':'#FFFCB3'} : {'background':'hsla(100, 100%, 51%, 0.15)'}]">
				<div class="row">
				<div class="col-sm-6">
					
					<div class="comment-author">

						<faveo-image-element id="user_img" :source-url="comments.user.profile_pic" :classes="['avatar', 'thread_avatar', lang_locale == 'ar' ? img : '']"/>
								
						<b class="fn">

							<span v-if="comments.user.first_name != ''" class="url" v-tooltip="comments.user.first_name +' '+ comments.user.last_name">
								{{subString(comments.user.first_name +' '+ comments.user.last_name,50)}}
							</span>
										
							<span v-else class="url" v-tooltip="comments.user.email">{{subString(comments.user.email,50)}}</span>
						</b>
					</div>

					<div class="comment-metadata">
								
						<small class="date text-muted">
									
							<time datetime="2013-10-23T01:50:50+00:00"><i class="fa fa-clock-o"></i>  {{formattedTime(comments.created_at)}}</time>
						</small>
					</div>
				</div>
			</div>
				
			</footer>

			<div class="comment-content" id="align">

				<p v-html="comments.body" id="comment_body" style="word-wrap: break-word;"></p>
			</div>

			<div v-if="comments.attach.length !=0" class="timeline-footer">
						
				<ul  class="mailbox-attachments clearfix" id="clearfix" 
					:class="[(lang_locale === 'ar') ? 'mr40' : 'ml40']">
						
					<template v-for="attachment in comments.attach">
						
						<template  v-if="attachment.poster !== 'INLINE'">
							
							<attachment :attachment="attachment" classname="info_btn"></attachment>
						</template>
					</template> 
				</ul>
			</div> 
		</article>

		<article v-else class="comment-body">
		
			<div v-if="loading" class="row" style="margin-top:30px;margin-bottom:30px">
		
				<loader :color="layout.portal.client_header_color" :animation-duration="4000" :size="60"/>
			</div>
		</article>

	</li>
</template>

<script>

	import { mapGetters } from 'vuex'

	import { getSubStringValue } from '../../../../../helpers/extraLogics'
    import AttachmentBlock from "../../../../MiniComponent/AttachmentBlock.vue";
    import ClientPanelTimelineRatings from "./ClientPanelTimelineRatings.vue";
    import FaveoImageElement from "../../../../Common/FaveoImageElement.vue";

	export default {

		props:{
	
			comments : {type: Object,required : true},

			dept : {type: String},

			userId : {type : [String,Number], required : true},

			layout : { type : Object, default :()=>{}},

			auth : { type : Object, default : ()=>{} },

			showRatings : { type :  Boolean, default : true},

			from : { type : String, default : ''},
			status_type : { type : String}

		},
		
		components:{
			
			'attachment':AttachmentBlock,
			
			'rating-component':ClientPanelTimelineRatings,

			'faveo-image-element': FaveoImageElement
		},

		data() {
	
			return {
	
				base: this.auth.system_url,
	
				loading:false,

				ticket_id:null,
	
				lang_locale : this.layout.language,

				ratings:[],

				linkStyle : {

					 color : this.layout.portal.client_header_color
				}
			}
		},

		computed:{
	
			...mapGetters(['formattedTime','formattedDate'])
	
		},

		methods :{
		
		subString(value,length = 15){
			
			return getSubStringValue(value,length)
		}
	}
};
</script>

<style scoped>
#comment-body{
	word-wrap: break-word !important;
}
#clearfix{
	display:inline-block !important; list-style-type: none !important;
}
.comment-reply {
	top : 7px !important; 
}
.left0{
	left: 0;
}
.mr40{
	margin-right: -40px !important;
}
.ml40{
	margin-left: -40px !important;
}

#align {     
	display: flow-root; 
}
.rate-post{
	margin-top: -0.5rem !important;
}
.thread_avatar{
	width: 50px;
  height: 50px;
}
</style>
<style scoped>
	#comment_body{
		overflow-x: auto;
	}

	.table{
		overflow-x: auto;
	}

	.ck-content table,.ck-content table td,.ck-content table tr,.ck-content table th {
		border: 1px solid #ddd;
		text-align: left;
	}

	.ck-content table {
		border-collapse: separate;
		width: 100%;
	}

	.ck-content p {
		margin : 0 !important;
	}

	.ck-content table th, .ck-content table td {
		padding: 15px;
	}
</style>