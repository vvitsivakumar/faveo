<template>
	
	<parsed-data :dataValue="data"></parsed-data>

</template>

<script>
	
	export default {

		props : {

			data : { type : String, default : '' }
		},

		beforeMount(){

			app.component('parsed-data',{

				props : ['dataValue'],
            
            template : '<div v-html="loadData()"></div>',

            methods : {

            	loadData() {

            		var parser = new DOMParser();
		 
					  	var doc = parser.parseFromString(this.dataValue, 'text/html');
					  	
					  	const root = doc.getElementsByTagName('body')[0];

					  	const anchors  = root.querySelectorAll('a');

					  	anchors.forEach(anchor => {

					  		if(anchor.href.includes(this.basePath())){

					  			let anchorArr = anchor.href.replace(this.basePath(),'').split('/');

						  		let modifiedArr = anchorArr.filter(item => item);

						  		if(modifiedArr[0] == 'check-ticket' ) {

						  			anchor.setAttribute('target','_blank');
						  			anchor = anchor;

						  		} else if(modifiedArr[0] == 'department' || modifiedArr[0] == 'team' || (modifiedArr[0] == 'service-desk' && modifiedArr[1] == 'products') || (modifiedArr[0] == 'service-desk' && modifiedArr[1] == 'vendor') || (modifiedArr[0] == 'service-desk' && modifiedArr[1] == 'manufacturers') || (modifiedArr[0] == 'service-desk' && modifiedArr[1] == 'deprication') ) {

								    anchor.setAttribute('target','_blank');
								    anchor.setAttribute('href',anchor.href.replace(this.basePath(),this.basePath()+'/admin'));
                    if(anchor.title == 'mention_link') {

                      anchor.setAttribute('data-id','mention_link');

                      anchor.setAttribute('title','');
                    }
								    anchor = anchor;

							    } else {

						  			const span = doc.createElement('a');

						  			if(!anchor.href.includes(this.basePath()+'/panel/') && !anchor.href.includes(this.basePath()+'/show/') && !anchor.href.includes(this.basePath()+'/category-list/')){

						  				span.setAttribute('href',anchor.href.replace(this.basePath(),this.basePath()+'/panel'));
						  			} else {

						  				span.setAttribute('href',anchor.href);
						  			}

							    	span.setAttribute('target','_blank');

							    	span.innerText = anchor.innerText;

                    if(anchor.title == 'mention_link') {

                      span.setAttribute('data-id','mention_link');

                      span.setAttribute('title','');
                    }
                    if (anchor.parentNode) {
                      anchor.parentNode.replaceChild(span, anchor);
                    }
						  		}
					  		}

					  		anchor.setAttribute('target','_blank');
					  });

					  return root.innerHTML;
            	}
            }
         });
		}
	};
</script>