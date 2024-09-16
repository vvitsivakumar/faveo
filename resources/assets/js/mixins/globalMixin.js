import {boolean, lang, sessionItems} from '../helpers/extraLogics'

import axios from "axios";

window.axios = axios;

export default {

    data() {

        return {

            lang : lang,

                isRtlLayout : boolean(sessionItems.isRtlLayout),

                headerColor:  sessionItems.headerColor,

                recaptchaSiteKey: sessionItems.recaptchaSiteKey,

                recaptchaVersion: sessionItems.recaptchaVersion,

                recaptchaApplyfor: sessionItems.recaptchaApplyfor,

                isUserLoggedIn: sessionItems.isUserLoggedIn,

                loggedUserName: sessionItems.loggedUserName,

                loggedUserMail: sessionItems.loggedUserMail,

                loggedUserRole: sessionItems.loggedUserRole,

                appVersion: sessionItems.appVersion,
        }
    },

    methods : {

        basePath : () => (window.axios.defaults.baseURL),

        basePathVersion() {
            return window.axios.defaults.baseURL + '/' + sessionItems.appVersion;
        },

        trans: (string) => lang(string),

        boolean : (value) => (boolean(value)),

        currentPath: () => (window.location.pathname),

        redirect: (path) => {
            if (window.axios && window.axios.defaults && window.axios.defaults.baseURL) {
                window.location.assign(window.axios.defaults.baseURL + path);
            } else {
                // Handle the error gracefully
                console.error('Error: axios defaults not set');
            }
        },

        sleep :  (ms) => new Promise(resolve => setTimeout(resolve, ms)),

        getSubString(str,len) {

            if (str) {
                if (str.length > len) {
                    return str.substring(0,len) + '...';
                } else {
                    return str;
                }
            }
        }
    }
    }