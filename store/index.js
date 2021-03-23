import Vue from 'vue';
import Vuex from 'vuex';

// Import the `getField` getter and the `updateField`
// mutation function from the `vuex-map-fields` module.
import {
  getField,
  updateField
} from 'vuex-map-fields';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    fieldA: 'Hello World',
    fieldB: '',
  },
  getters: {
    // Add the `getField` getter to the
    // `getters` of your Vuex store instance.
    getField,
  },
  mutations: {
    // Add the `updateField` mutation to the
    // `mutations` of your Vuex store instance.
    updateField,
  },
});
