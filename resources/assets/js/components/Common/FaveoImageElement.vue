<template>
  <img
    :id="id"
    :src="getSrc"
    :class="classes"
    :alt="alternativeText"
    :width="imgWidth"
    :height="imgHeight"
    :style="styleObject"
    @error="onImageLoadError($event)"
  />
</template>

<script>
export default {

  name: 'faveo-image-element',

  description: 'Common element for image tag',

  props: {

    /**
     * Unique id of the image
     */
    id: {
      type: String,
      required: true
    },

    /**
     * src atrribute value
     */
    sourceUrl: {
      type: String,
      required: true
    },

    /**
     * Used to style the image
     */
    styleObject: {
      type: Object,
      default: () => {}
    },

    /**
     * Class names (bootstrap/admineLTE)
     */
    classes: {
      type: Array,
      default: () => []
    },

    /**alt attribute text */
    alternativeText: {
      type: String,
      default: ''
    },

    /**Image width */
    imgWidth: {
      type: [Number, String],
      default: 'auto'
    },

    /** Image height */
    imgHeight: {
      type: [Number, String],
      default: 'auto'
    },

    /**
     * file name of the image
     * Used when onError event fired
     * ----OR----
     * `sourceUrl` is not truthy
     * 
     * NOTE: This file must be present in /themes/default/common/images directory
     */
    defaultImage: {
      type: String,
      default: 'contacthead.png'
    }
  },

  data: () => {
    return {

    }
  },

  computed: {
    getSrc: function() {
      return this.sourceUrl ? this.sourceUrl : this.basePathVersion() + '/themes/default/common/images/' + this.defaultImage;
    }
  },


  methods: {
    /**
     * we will need `onerror` hook else without internet it will show a broken image
    **/
    onImageLoadError(event) {
      event.target.onerror = null;
      event.target.src = this.basePathVersion() + '/themes/default/common/images/' + this.defaultImage;
    }
  }

};
</script>

<style scoped>
</style>
