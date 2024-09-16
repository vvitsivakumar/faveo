<template>
    <form-field-template :label="label" :labelStyle="labelStyle" :name="name" :classname="classname" :hint="hint" :required="required" :isInlineForm="isInlineForm" :tipRule="tipRule"
    :labelLength="labelLength">

      <file-manager-container v-if="mediaOption && panel != 'client'"
        v-on:filesChosen="getAttachmentInfo"
      />

    <ValidationProvider :name="name" :rules="rules" v-model="editorValue">
      <template v-slot="{ field, errorMessage, meta, classes }">

        <editor :init="options" v-model="editorValue" @onChange="onChange(editorValue, name)" :name="name" :class="errorMessage ? 'field-danger' : ''" />

          <span v-if="errorMessage" class="error-block is-danger">{{errorMessage}}</span>

      </template>
    </ValidationProvider>

      <template v-if="loading">
        <custom-loader duration="4000" />
      </template>

    <template v-for="(attachment,index) in attachmentsArr">

        <div id='hidden-attach' contenteditable='false' v-if="attachment.disposition !== 'inline'">

          {{attachment.name}}({{attachment.size ? attachment.size : attachment.file_size}} bytes)

          <i class='fa fa-times close-icon' aria-hidden='true' @click='removeAttachment(index)'></i>
        </div>
      </template>

  </form-field-template>
</template>

<script>

  import Editor from '@tinymce/tinymce-vue';
  import { plugins, editorProps } from "./tinyMceDefaults";
  import FormFieldTemplate from "../../MiniComponent/FormField/FormFieldTemplate.vue";
  import FileManagerContainer from "../../Agent/Filemanager/FileManagerContainer.vue";
  import  {mapGetters,mapActions,mapMutations,mapState} from "vuex";


  export default {

    name: "tiny-editor-with-validation",

    description: 'TinyMCE Editor With Validations',

    props: {

      ...editorProps,

      label: { type: String, default: '' },

      name: { type: String, required: false },

      value: { type: String, required: false },

      isInlineForm: { type: Boolean, default: false },

      required: { type: Boolean, default: false },

      rules: { type: String, default: '' },

      hint: { type: String, default: '' },

      /**
      * for show labels of the fields
      * @type {Object}
      */
      labelStyle:{type:Object},

      /**
       * classname of the form field. It can be used to give this component any bootstrap class or a custom class
       * whose css will be defined in parent class
       * @type {String}
       */
      classname: { type: String, default: "" },

      /**
       * The function which will be called as soon as value of the field changes
       * It should have two arguments `value` and `name`
       *     `value` will be the updated value of the field
       *     `name` will be thw name of the state in the parent class
       *
       * An example function :
       *         onChange(value, name){
       *             this[name]= selectedValue
       *         }
       *
       * @type {Function}
       */
      onChange: { type: Function, Required: true },

      mediaOption: { type: [Boolean, Number], default: false },

      attachments : { type : Array, default : ()=> []},

      getAttach : { type : Function },

      panel : { type : String, default : '' },

      //FOR TOOLTIP POSITION
      tipRule : { type : [Number, Boolean], default : false },

      /**
       * For restricting Editor to resolve URLs to relative or absolute URL
       * @see https://www.tiny.cloud/docs-3x/reference/Configuration3x/Configuration3x@convert_urls/
       */
       convertURLs : {type : Boolean, default : true},
	    
	    labelLength : { type : [Number, String], default : 500 }
    },

    created () {
      this.getCsrfToken();
    },

    data() {
      return {
        loading: false,
        attachmentsArr : this.attachments,
        editorValue : this.value,
        options: {}
      }
    },

      beforeMount() {
        this.attachmentsArr=this.getAttachmentsData !=null ? this.getAttachmentsData :this.attachments;

        const self = this;

        this.options = {

            max_height: self.height,
            min_height: self.height,
            menubar: (self.showMenubar) ? 'file edit view insert format tools table help' : false,
            menu: {
              view: {
                title: 'View',
                items: 'code | visualchars visualblocks | preview'
              },
            },
            toolbar_sticky: self.toolbarSticky,
            autosave_ask_before_unload: self.autoSaveAskBeforeUnload,
            autosave_interval: self.autoSaveInterval,
            autosave_prefix: 'tinymce-autosave-{path}{query}-{id}-',
            autosave_restore_when_empty: self.autoSaveRestoreWhenEmpty,
            autosave_retention: self.autoSaveRetention,
            image_advtab: self.imageAdvancedTab,
            template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
            template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
            image_caption: self.imageCaption,
            quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
            extended_valid_elements: 'div[onclick|style]',
            noneditable_noneditable_class: 'mceNonEditable',
            toolbar_mode: self.toolbarMode,
            contextmenu: false,
            content_style: self.contentStyle,
            draggable_modal: self.draggableModal,
            elementpath: self.elementPath,
            height: self.height,
            resize: self.resize,
            branding: self.branding,
            browser_spellcheck: self.browserSpellcheck,
            custom_undo_redo_levels: self.customUndoRedoLevels,
            paste_data_images: self.pasteDataImages,
            statusbar: self.statusbar,
            auto_focus:self.autoFocus,
            automatic_uploads: self.automaticUploads,
            relative_urls: self.relativeUrls,
            remove_script_host: self.removeScriptHost,
            document_base_url: self.basePath(),
            images_upload_url: self.basePath() + '/api/tiny-image-uploader?_token=' + document.querySelector('meta[name="csrf-token"]').getAttribute('content')+'&auth=false&api_key='+this.getApiKey,
            convert_urls : self.convertURLs,
            plugins: (self.page !== 'kb') ? plugins.filter(element => element !== 'media') : plugins,
			text_patterns: self.textpattern_patterns,
            setup: function(editor) {
                editor.on('Keyup', function () {
                    self.onChange(editor.getContent(),self.name)
                });

                editor.on('Change', function () {
                    self.onChange(editor.getContent(),self.name)
                });
            },
            toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media link codesample | ltr rtl'
        }
      },

      watch: {
      value: {
        immediate: true,
        handler (value, oldValue) {
          this.editorValue = value;
        }
      },
    },


    computed: {
      ...mapGetters(['getAttachmentsData','getApiKey']),

    },


    methods: {

      getCsrfToken() {
         
          if(this.getApiKey) {
              
              this.options.images_upload_url = this.basePath() + '/api/tiny-image-uploader?_token=' + document.querySelector('meta[name="csrf-token"]').getAttribute('content')+'&api_key='+this.getApiKey;
              
          } else {

              this.options.images_upload_url = this.basePath() + '/api/tiny-image-uploader?_token=' + document.querySelector('meta[name="csrf-token"]').getAttribute('content');
              
          }
      },

      removeAttachment(x){

        this.attachmentsArr.splice(x,1);

        this.getAttach(this.attachmentsArr);
      },

      async getAttachmentInfo(filesInfo) {
         let files = JSON.stringify(filesInfo.files);
         this.loading = true
        try {
          let response = await axios.get('file-manager/files-info', {
            params: {names: files, disk: filesInfo.disk}
          })
          let data = response.data.data;
          data.forEach((file) => {this.attachmentsArr.push(file)});
          this.getAttach(this.attachmentsArr);

        } catch (e) {
          await this.$store.dispatch('setAlert', {
            type: 'danger',
            message: this.lang('file-manager-modal-error-message'),
            component_name: 'faveo-form'
          })
        } finally {
          this.loading = false;
        }
      },
    },

    components: {
      editor: Editor,
      'form-field-template': FormFieldTemplate,

		"file-manager-container" : FileManagerContainer
    },
  }

</script>

<style scoped>
  #hidden-attach{
    background-color: #f5f5f5;
    border: 1px solid #dcdcdc;
    font-weight: bold;
    margin-top:9px;
    overflow-y: hidden;
    padding: 4px 4px 4px 8px;
  }

  .close-icon{
    float:right;cursor: pointer;
  }

  .tox .tox-editor-header{
    z-index: 1!important;
  }

  .tox .tox-dialog__body-nav-item:nth-child(4) {
    display: none !important;
  }

  .tox .tox-dialog--width-lg{
    max-width: 1000px!important;
  }
</style>