<template>
  <div>
    <form-field-template :label="label" :labelStyle="labelStyle" :name="name" :classname="classname" :hint="hint" :required="required">

      <editor :id="id"
          :init="options"
          v-model="editorValue"
          @onChange="onChange(editorValue, name)"
      />

    </form-field-template>

  </div>
</template>


<script>

import Editor from '@tinymce/tinymce-vue';
import { plugins, editorProps } from "./tinyMceDefaults";
import FormFieldTemplate from "../../MiniComponent/FormField/FormFieldTemplate.vue";

export default {
  name: 'TinyMCE',

  components: {
    'editor': Editor,
    'form-field-template': FormFieldTemplate
  },

  props: {

    ...editorProps,

    name: {type: String, Required:true},

    onChange: { type: Function, Required: true },

    label: {type: String, default: ''},

    labelStyle:{type:Object, default: function () { return { }}},

    classname: { type: String, default: "" },

    hint: { type: String, default: "" },

    required: { type: Boolean, default: false },

    value: {type: String, default:""},

    page: {type: String, default:""}, //possible values kb,reply

    id : { type : String, default : 'tiny_editor'}

  },

  data() {
    return {

      editorValue: this.value,

      options: {}
    }
  },

  beforeMount () {

    const self = this;

    this.options = {

        width:self.width,
        menubar: (self.showMenubar) ? 'file view edit insert format tools table help' : false,
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
      auto_focus:self.id == 'focus_editor' ? 'focus_editor' : '',
      automatic_uploads: self.automaticUploads,
        relative_urls: self.relativeUrls,
        remove_script_host: self.removeScriptHost,
        document_base_url: self.basePath(),
        //Uploading images with optional authentication parameter.
        images_upload_url: self.basePath()+'/api/tiny-image-uploader?_token='+document.querySelector('meta[name="csrf-token"]').getAttribute('content')+'&auth=false',
        plugins: (self.page !== 'kb') ? plugins.filter(element => element !== 'media') : plugins,
        external_plugins: {
          'mention' : self.basePathVersion()+'/themes/default/common/js/tinymce-mention.js'
        },
      mentions: {

        delimiter: ['@', '#', '$'],

        source: function (query, process, delimiter) {

          if (delimiter === '@') {

            axios.get('/api/dependency/agents?limit=all').then(res=>{

              res.data.data.agents.map(function(obj) {

                obj['name'] = obj.meta_name ? obj.meta_name.replaceAll('<','(').replaceAll('>',')') : obj.name;

                obj['route_path'] = self.basePath()+'/panel/user/'+obj.id;
              })

              process(res.data.data.agents)
            })
          }

          if (delimiter === '#') {

            axios.get('/api/dependency/departments?limit=all').then(res=>{

              res.data.data.departments.map(function(obj) {

                obj['route_path'] = self.basePath()+'/department/'+obj.id;
              })

              process(res.data.data.departments)
            })
          }

          if (delimiter === '$') {

            axios.get('/api/dependency/teams?meta=true&limit=all').then(res=>{

              res.data.data.teams.map(function(obj) {

                obj['route_path'] = self.basePath()+'/team/'+obj.id;
              })

              process(res.data.data.teams)
            })
          }
        }
      },
      setup: function (editor) {

        editor.on('focus', function () {
          editor.selection.select(editor.getBody(), true);
          editor.selection.collapse(false);
        });

        editor.on('Keyup', function () {
          self.onChange(editor.getContent(), self.name);
        });

        editor.on('Change', function () {
          self.onChange(editor.getContent(), self.name);
        });
      },
		toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl'

      }
  },

  watch: {
    value: {
      immediate: true,
      handler (value, oldValue) {
        this.editorValue = value;
      }
    }
  }
}

</script>

<style>

.tox-dialog {
  z-index: 1650 !important;
}

.tox .tox-dialog-wrap__backdrop {
  z-index: 1600 !important;
}

.rte-autocomplete {
  max-height: 200px;
  overflow: auto;
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
