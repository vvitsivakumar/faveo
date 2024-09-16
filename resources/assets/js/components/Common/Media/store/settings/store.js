import mutations from './mutations';
import getters from './getters';

// languages
import ru from '../../lang/ru';
import en from '../../lang/en';
import ar from '../../lang/ar';
import sr from '../../lang/sr';
import cs from '../../lang/cs';
import de from '../../lang/de';
import es from '../../lang/es';
import nl from '../../lang/nl';
/* eslint camelcase: 0 */
import zh_CN from '../../lang/zh_CN';
import fa from '../../lang/fa';
import it from '../../lang/it';
import tr from '../../lang/tr';
import fr from '../../lang/fr';
import pt_BR from '../../lang/pt_BR';
import zh_TW from '../../lang/zh_TW';
import pl from '../../lang/pl';
import hu from '../../lang/hu';
import bsn from '../../lang/bsn';
import vi from '../../lang/vi';
import id from '../../lang/id';
import no from '../../lang/no';
import kr from '../../lang/kr';
import mt from '../../lang/mt';

export default {
    namespaced: true,
        state() {
            return {
                // ACL
                acl: null,

                // App version
                version: '3.0.3',

                // axios headers
                headers: {},

                // axios default URL
                baseUrl: null,

                // max number files that can be uploaded
                maxFileUploadCount: 0,

                // max single file size
                maxSingleFileSize: 0,

                // max post size
                maxPostSize: 0,

                // date filter
                dateFilter: null,

                // type filter
                typeFilter: null,

                searchText: null,

                toggleFilter: false,

                /**
                 * File manager windows configuration
                 * 1 - only one file manager window
                 * 2 - one file manager window with directories tree module
                 * 3 - two file manager windows
                 */
                windowsConfig: null,

                // App language
                lang: null,

                // Translations (/src/lang)
                translations: {
                    ru: Object.freeze(ru),
                    en: Object.freeze(en),
                    ar: Object.freeze(ar),
                    sr: Object.freeze(sr),
                    cs: Object.freeze(cs),
                    de: Object.freeze(de),
                    es: Object.freeze(es),
                    nl: Object.freeze(nl),
                    'zh-hans': Object.freeze(zh_CN),
                    fa: Object.freeze(fa),
                    it: Object.freeze(it),
                    tr: Object.freeze(tr),
                    fr: Object.freeze(fr),
                    pt: Object.freeze(pt_BR),
                    'zh-hant': Object.freeze(zh_TW),
                    pl: Object.freeze(pl),
                    hu: Object.freeze(hu),
                    bsn : Object.freeze(bsn),
                    vi : Object.freeze(vi),
                    id : Object.freeze(id),
                    no : Object.freeze(no),
                    kr : Object.freeze(kr),
                    mt : Object.freeze(mt),
                },

                // show or hide hidden files
                hiddenFiles: false,

                // Context menu items
                contextMenu: [
                [
                    {
                        name: 'open',
                        icon: 'far fa-folder-open',
                },
                    {
                        name: 'audioPlay',
                        icon: 'fas fa-play',
                },
                    {
                        name: 'videoPlay',
                        icon: 'fas fa-play',
                },
                    {
                        name: 'view',
                        icon: 'fas fa-eye',
                },
                    {
                        name: 'select',
                        icon: 'fas fa-check',
                },
                    {
                        name: 'download',
                        icon: 'fas fa-download',
                },
                ],[
                    {
                        name: 'delete',
                        icon: 'far fa-trash-alt text-danger',
                },
                ], [
                    {
                        name: 'properties',
                        icon: 'far fa-list-alt',
                },
                ],
                ],

                // Image extensions for view and preview
                imageExtensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'],

                // Image extensions for cropping
                cropExtensions: ['png', 'jpg', 'jpeg'],

                // audio extensions for play
                audioExtensions: ['ogg', 'mp3', 'aac', 'wav'],

                // video extensions for play
                videoExtensions: ['webm', 'mp4'],

                // File extensions for code editor
                textExtensions: {
                    sh: 'text/x-sh',
                    // styles
                    css: 'text/css',
                    less: 'text/x-less',
                    sass: 'text/x-sass',
                    scss: 'text/x-scss',
                    html: 'text/html',
                    // js
                    js: 'text/javascript',
                    ts: 'text/typescript',
                    vue: 'text/x-vue',
                    // text
                    htaccess: 'text/plain',
                    env: 'text/plain',
                    txt: 'text/plain',
                    log: 'text/plain',
                    ini: 'text/x-ini',
                    xml: 'application/xml',
                    md: 'text/x-markdown',
                    // c-like
                    java: 'text/x-java',
                    c: 'text/x-csrc',
                    cpp: 'text/x-c++src',
                    cs: 'text/x-csharp',
                    scl: 'text/x-scala',
                    php: 'application/x-httpd-php',
                    // DB
                    sql: 'text/x-sql',
                    // other
                    pl: 'text/x-perl',
                    py: 'text/x-python',
                    lua: 'text/x-lua',
                    swift: 'text/x-swift',
                    rb: 'text/x-ruby',
                    go: 'text/x-go',
                    yaml: 'text/x-yaml',
                    json: 'application/json',
                },
            };
    },
    mutations,
    getters,
};
