import Vue from 'vue';
import Vuex from 'vuex';
import {
  products
} from './products';
import { customers } from './customers';
import { members } from "./members";

// Import the `getField` getter and the `updateField`
// mutation function from the `vuex-map-fields` module.
import {
  getField,
  updateField
} from 'vuex-map-fields';
import _ from "lodash";
import randomColor from "randomcolor";

Vue.use(Vuex);

const sortBy = Object.keys(products[0] || {});
sortBy.unshift("None");

const categories = _.sortedUniq(products.map(e => e.category));
const category = categories.filter((value, index, self) => self.indexOf(value) === index);
const categoryColours = _.zipObject(categories, categories.map(_ => randomColor({
  hue: 'random',
  luminosity: 'random'
})));

const createStore = () => new Vuex.Store({
  state: {
    members,
    products,
    customers,
    carts: [],
    header: "{{header}}",
    checkout: {
      search: "",
      sort: "None",
      sortBy,
      categories,
      categoryColours,
      category,
      payment: {
        customer: "",
        search: "",
      },
      customerProfile: {
        displayName: "Fake Customer 001",
        customerID: "63130500227",
        show: true,
        store: 0,
        visit: 0,
        reward: 0
      }
    },
    auth: {
      user: {
        id: 1,
        image: "",
        firstName: "",
        lastName: "",
        phone: "",
        memberID: "",
        iat: "",
        uat: "",
        role: "",
        email: "",
        // fake auth
        username: "",
        get displayName() {
          return `${this.firstName} ${this.lastName}`
        }
      },
      isLoggedIn: false
    },
    history: {
      payment: []
    }
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
