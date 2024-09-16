import { defineConfig, splitVendorChunkPlugin } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import * as ini from 'ini';
import * as fs from 'fs';

const iniConfig = ini.parse(fs.readFileSync('./storage/faveoconfig.ini', 'utf-8'));
const version = iniConfig.APP_VERSION;

export default defineConfig({

    server: {
        hmr: {
            host: 'localhost',
        },
    },

    resolve: {
        alias: {
            vue: 'vue/dist/vue.esm-bundler.js',
            '@': '/resources/assets/js',
        }
    },
    build: {
        emptyOutDir: true,
        rollupOptions: {
            output: {
                assetFileNames : `${version}/assets/[name][extname]`,
                chunkFileNames : `${version}/chunks/[name].js`,
                entryFileNames : `${version}/entry/[name].js`,
            },
        },
    },

    plugins: [
        splitVendorChunkPlugin(),
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => {
                        return tag.startsWith('is-') // (return true)
                    }
                }
            }
        }),
        laravel({
            input: [
                'resources/assets/js/app.js',
                'resources/assets/js/admin.js',
                'resources/assets/js/agent.js',
                'resources/assets/js/navigation.js',
                'resources/assets/js/headerMenu.js',
                'resources/assets/js/chatWidget.js',
                'resources/assets/js/helpwidget.js',
                'app/Plugins/Ldap/views/js/ldap.js',
                'app/Plugins/Facebook/views/js/facebook.js',
                'app/Plugins/Calendar/views/js/calendar.js',
                'app/Plugins/Whatsapp/views/js/whatsapp.js',
                'app/Plugins/AdHocApproval/views/js/adHocApproval.js',
                'app/Plugins/Chat/views/js/chat.js',
                'app/Plugins/CustomCSS/views/js/customCss.js',
                'app/FaveoLog/views/js/systemLog.js',
                'app/Bill/views/js/systemBilling.js',
                'app/Plugins/ServiceDesk/views/js/serviceDesk.js',
                'app/FaveoReport/views/js/systemReport.js',
                'app/Plugins/Telephony/views/js/telephony.js',
                'app/Plugins/Twitter/views/js/twitter.js',
                'app/Plugins/AzureActiveDirectory/views/js/azureActiveDirectory.js',
                'app/Plugins/AllianceCRM/views/js/allianceCRM.js',
                'app/Plugins/CRTWorkflow/views/js/crtWorkflow.js',
                'app/AutoAssign/views/js/autoAssign.js',
                'app/Plugins/SMS/views/js/sms.js',
                'app/Plugins/CustomJs/views/js/customJs.js',
                'app/Plugins/DepartmentStatusLink/views/js/departmentStatus.js',
                'app/Location/views/js/systemLocation.js',
                'app/Plugins/LimeSurvey/views/js/limesurvey.js',
                'app/Plugins/TicketArchive/views/js/TicketArchive.js',
                'app/TimeTrack/resources/views/js/timeTrack.js',
                'app/Notify/views/js/notify.js',
                'app/Plugins/CustomLanguage/views/js/customLang.js',
                'app/FaveoModule/views/js/optimizeModules.js',
                'app/Plugins/CustomLanguage/views/js/customLang.js',
                'app/Health/views/js/healthCheck.js',
                'app/Plugins/Slack/views/js/slack.js',
                'app/Plugins/Instagram/views/js/instagram.js',
                'app/Plugins/Line/views/js/line.js',
                'app/Plugins/Zendesk/views/js/zendesk.js',
            ],
            refresh: true,
        })
    ]
});