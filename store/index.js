import Vue from 'vue';
import Vuex from 'vuex';
import {
  products
} from './products';
import {
  customers
} from './customers';
import {
  members
} from "./members";
import {
  roles
} from './role';

// Import the `getField` getter and the `updateField`
// mutation function from the `vuex-map-fields` module.
import {
  getField,
  updateField
} from 'vuex-map-fields';
import _ from "lodash";
import randomColor from "randomcolor";

Vue.use(Vuex);
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";

var ls = new SecureLS({
  isCompression: false
});

import {
  customAlphabet
} from 'nanoid';
const alphabet = '0123456789ABCDEF';
const nanoid = customAlphabet(alphabet, 20);

const sortBy = Object.keys(products[0] || {});
sortBy.unshift("None");

const categories = _.sortedUniq(products.map(e => e.category));
const category = categories.filter((value, index, self) => self.indexOf(value) === index);
const categoryColours = _.zipObject(categories, categories.map(_ => randomColor({
  hue: 'random',
  luminosity: 'random'
})));

const createStore = () => new Vuex.Store({
  plugins: [createPersistedState({
    key: "fakestore",
    fetchBeforeUse: true,
    storage: {
      getItem: (key) => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key),
    },
  })],
  state: {
    members,
    roles,
    products: products.map(product => ({
      ...product,
      productID: nanoid()
    })),
    customers,
    carts: [],
    header: "{{header}}",
    toggle_exclusive: undefined,
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
    },
    persistentToken: nanoid()
  },
  getters: {
    // Add the `getField` getter to the
    // `getters` of your Vuex store instance.
    getField,
    dashboard(state) {
      const customers = state.customers.length;
      const inStock = state.products.length;
      const grossSale = state.carts.reduce((r, a) => Number.parseFloat(r) + Number.parseFloat(a.price) * Number.parseInt(a.quantity), 0);
      const productSale = state.carts.reduce((r, a) => Number.parseInt(r) + Number.parseInt(a.quantity), 0);

      return {
        grossSale,
        productSale,
        inStock,
        customers
      }
    },
  },
  mutations: {
    // Add the `updateField` mutation to the
    // `mutations` of your Vuex store instance.
    updateField,
    updatePersistent(state) {
      state.persistentToken = nanoid()
      console.log(state.persistentToken);
    }
  },
  actions: {
    up({
      commit
    }) {
      commit("updatePersistent")
    }
  }
});

export default createStore;
