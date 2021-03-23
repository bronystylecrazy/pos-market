import Vue from 'vue';
import Vuex from 'vuex';
import {
  products
} from './products';

// Import the `getField` getter and the `updateField`
// mutation function from the `vuex-map-fields` module.
import {
  getField,
  updateField
} from 'vuex-map-fields';

Vue.use(Vuex);


const createStore = () => new Vuex.Store({
  state: {
    products,
    carts: [],
    header: "Home"
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

export default createStore;
