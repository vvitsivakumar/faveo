<template>

	<span class="dynamic-hyper-link">

		<span v-if="data[colName]">

			<template v-if="keySplits[1]">

				<span v-if="data[keySplits[0]][keySplits[1]]">

					<span v-if="getRoute(data[keySplits[0]][keySplits[1]],href,keyVal)">

						<router-link
                v-for="(value, index) in getAssets(data[keySplits[0]][keySplits[1]])"
                :key="index"
                :tag="getRoute(value, tag, keyVal)"
                :to="getRoute(value, href, keyVal)"
            >
              <span v-html="getRoute(value, text, keyVal)"></span>
              <span v-if="index < getAssets(data[keySplits[0]][keySplits[1]]).length - 1">, </span>
            </router-link>
					</span>

					<span v-else v-html="data[keySplits[0]][keySplits[1]]"></span>
				</span>
			</template>

			<template v-else>

				<span v-if="data[keySplits[0]]">

					<span v-if="getRoute(data[keyName],href,keyVal)">

						<router-link
                v-for="(value, index) in getAssets(data[keyName])"
                :key="index"
                :tag="getRoute(value, tag, keyVal)"
                :to="getRoute(value, href, keyVal)"
            >
              <span v-html="getRoute(value, text, keyVal)"></span>
              <span v-if="index < getAssets(data[keyName]).length - 1">, </span>
            </router-link>
					</span>

					<span v-else v-html="data[keyName]"></span>
				</span>
			</template>
		</span>

		<span v-else>--</span>
	</span>
</template>

<script>

	export default {

		props: ['data', 'keyName', 'colName'],

		data() {

			return {

				href : 'href',

				text:'innerText',

				tag:'tag',

				keyVal : this.keyName,

				keySplits : []
			}
		},

		beforeMount() {
			this.keySplits = this.keyName.split('.')
		},

		methods : {

      getAssets(value) {

        if (typeof value === 'string') {
			
			if(this.$route.name === 'User Directory' && this.keyVal === 'labels') {
			
				return [value];
			}
			
          return value.split(',');
        
		} else {
        
          return [];
        }
      },

			getRoute(value,attr,keyValue) {

				let currentPath = location.pathname.split('/')[location.pathname.split('/').length - 2];

				let parser = new DOMParser();

				let doc = parser.parseFromString(value, 'text/html');

				let elements = doc.getElementsByTagName("a");

				let par = elements[elements.length - 1];

				if(par == undefined) {

					return attr == 'href' ? '' : attr == 'tag' ? 'span' : doc.getElementsByTagName('body')[0].innerHTML;

				} else {

					if(keyValue == 'name' && (currentPath == 'department-performance' || currentPath == 'team-performance') || (attr == 'href' && par[attr].includes('department')) || (attr == 'href' && par[attr].includes('team'))) {

						return attr == 'href' ? '' : attr == 'tag' ? 'span' : doc.getElementsByTagName('body')[0].innerHTML;
					} else {
      
						return attr == 'href' ? par[attr].replace(this.basePath(),'') : attr == 'tag' ? 'a' : par[attr];
					}
				}
			}
		}
	}
</script>