import { config } from '@vue/test-utils'
import axios from "axios";

import mitt from 'mitt';
window.emitter = mitt()
import globalMixin from "./resources/assets/js/mixins/globalMixin";

config.global.mixins = [globalMixin]
config.global.mocks = {
    axios,
    $Progress : {
        start : jest.fn(),
        fail : jest.fn()
    },
    $router :{
        push : jest.fn()
    }
}
config.global.directives = { 'scroll-ajax' : jest.fn(), 'scroll-to' : jest.fn(),tooltip : jest.fn(), captcha : jest.fn(), 'focus-first-input' : jest.fn() }

config.global.stubs = [
    'router-link',
    'reuse-loader',
    'modal',
    'loader',
    'custom-loader',
    'data-table',
    'faveo-image-element',
    'popover',
    'faveo-box',
    'alert',
    'ValidationObserver','ValidationProvider','ErrorMessage',
    'tiny-editor',
    'draggable-form-field-item',
    'tiny-editor-with-validation',
    'client-panel-loader'
]

jest.mock('./resources/assets/js/helpers/responseHandler');

jest.mock('epic-spinners', () => ({
    FulfillingBouncingCircleSpinner: () => null, // Provide a dummy implementation
}));

import { createStore } from 'vuex';
import { createRouter, createMemoryHistory } from 'vue-router';

// Mock store
global.mockStore = createStore({
    // Vuex store configuration
});

// Mock router instance
global.mockRouter = createRouter({
    history: createMemoryHistory(),
    routes: [
        {path: '/', component: {}}
    ],
});