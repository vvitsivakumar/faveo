import { mount } from '@vue/test-utils';
import SaveReportModal from './../../views/js/components/SaveReportModal.vue';
import * as extraLogics from "helpers/extraLogics";
import {createStore} from "vuex";

let wrapper;

import axios from "axios";
import MockAdapter from "axios-mock-adapter";
let axiosMock;

global.confirm = jest.fn(() => {
  return true;
})

let store;

let getters = {
  formattedTime: () => () => {return ''},
}

store = createStore({
  getters
})

describe('SaveReportModal', () => {

  let mountComponent = (modalMode = 'fork') => {

    extraLogics.getIdFromUrl = () => { return 3 };

    wrapper = mount(SaveReportModal, {
      global : {
        stubs: ['text-field', 'checkbox'],
        plugins : [store]
      },
      props: {
        modalMode: modalMode,
        reportDataObj: {
          id: 3,
          name: 'report_name',
          description: 'report_description',
          is_public: true
        },
        onClose: () => jest.fn()
      }
    });
  }

  beforeEach(() => {
    axiosMock = new MockAdapter(axios);
    mountComponent();
  });

  afterEach(() => {
    if(axiosMock) { axiosMock.restore();}
  });

  it('setUpComponentPropertiesBasisOfMode will setup component properties basis of mode', () => {
    expect(wrapper.vm.title).toBe('fork_this_report');

    mountComponent('update');
    expect(wrapper.vm.title).toBe('update_this_report');
    expect(wrapper.vm.name).toBe('report_name');
    expect(wrapper.vm.description).toBe('report_description');
    expect(wrapper.vm.isPublic).toBe(true);
  })

  it('getSaveReportParams will return parameters', () => {
    expect(wrapper.vm.getSaveReportParams().id).toBe(null);

    mountComponent('update');
    expect(wrapper.vm.getSaveReportParams().name).toBe('report_name');
    expect(wrapper.vm.getSaveReportParams().description).toBe('report_description');
    expect(wrapper.vm.getSaveReportParams().is_public).toBe(true);
  })

  it('onSubmit save/update the report -- SUCCESS', function (done) {

    wrapper.vm.getSaveReportParams = jest.fn(() => { return {} });

    mockSubmitReq()

    wrapper.vm.onSubmit();

    setTimeout(()=>{
      expect(axiosMock.history.post[0].url).toBe('api/agent/report-config/3')
      expect(wrapper.vm.isLoading).toBe(false);
      done();
    },1)
  })

  it('onSubmit save/update the report -- ERROR', function (done) {

    wrapper.vm.getSaveReportParams = jest.fn(() => { return {} });
    mockSubmitReq()
    wrapper.vm.onSubmit();

    setTimeout(()=>{
      expect(axiosMock.history.post[0].url).toBe('api/agent/report-config/3')
      expect(wrapper.vm.isLoading).toBe(false);
      done();
    },1)
  })

})

function mockSubmitReq(status=200,url='api/agent/report-config/3'){
  axiosMock.onPost(url).reply(status, {});
}