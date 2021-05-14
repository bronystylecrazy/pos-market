import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

import {
  getField,
  updateField
} from 'vuex-map-fields';

import qs from 'qs';
import SecureLS from "secure-ls";

Vue.use(Vuex);

const ls = new SecureLS({
  isCompression: false
});

const vuexPersistent = createPersistedState({
  key: "fakestore",
  paths: ["auth"],
  fetchBeforeUse: true,
  storage: {
    getItem: (key) => ls.get(key),
    setItem: (key, value) => ls.set(key, value),
    removeItem: (key) => ls.remove(key),
  },
});


const createStore = () => new Vuex.Store({
  plugins: [vuexPersistent],
  state: {
    header: "{{header}}",
    //arrays
    members: [],
    roles: [],
    products: [],
    customers: [],
    categories: [],
    dashboard: {
      overview: {
        productInStock: 0,
        grossSales: 0.0,
        productSales: 0,
        customers: 0
      }
    },
    checkout: {
      carts: [],
      monitorCarts: [],
      payment: {
        customer: "",
        search: "",
      },
      customer: {

      }
    },
    auth: {
      user: {

      },
      isLoggedIn: false,
      access_token: ""
    },
    application: {
      loading: true,
      websocket: false,
      setting: {
        realtime_notify: true,
        console_log: true
      },
      appbar: true
    },
    realtime: {
      socket: null,
      stompClient: null,
    }
  },
  getters: {
    getField,
    serializeCheckout(state) {
      const obj = {};
      for (var product of state.checkout.carts) {
        if (product.id in obj) {
          obj[product.id].buy++;
        } else {
          obj[product.id] = {
            buy: 1,
            ...product
          };
        }
      }
      const serialize = [];
      for (var product in obj) {
        serialize.push(obj[product]);
      }
      return serialize;
    }
  },
  mutations: {
    updateField,
    SET_DASHBOARD_OVERVIEW(state, overview) {
      state.dashboard.overview = overview;
    },
    SET_AUTH_USER(state, profile) {
      state.auth.user = profile;
    },
    SET_APPLICATION_LOADING(state, isLoading) {
      state.application.loading = isLoading;
    },
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    SET_CUSTOMERS(state, customers) {
      state.customers = customers;
    },
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
    SET_MEMBERS(state, members) {
      state.members = members;
    }, // USERS
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
    LOGOUT(state, qs) {
      localStorage.clear();
      state.auth.isLoggedIn = false;
      state.auth.user = {};
      this.$router.push(`/login${typeof qs === "undefined" ? "" : "?"+qs}`);
    }
  },
  actions: {
    async register(app, params) {
      const {
        data
      } = await this.$axios.post(`/account/register?${qs.stringify(params)}`);
      return data;
    },
    async login(app, params) {
      const {
        data
      } = await this.$axios.post(`/account/login?${qs.stringify(params)}`);
      return data;
    },
    async deleteAccount(app, uid) {
      console.log("deleteAccount", uid)
      const {
        data
      } = await this.$axios.delete(`/account/${uid}`);
      return data;
    },
    async fetchOverview({
      commit,
      state
    }) {
      commit('SET_APPLICATION_LOADING', true)
      const {
        data
      } = await this.$axios.get(`/transaction/overview?token=${state.auth.access_token}`);
      commit("SET_DASHBOARD_OVERVIEW", data.response);
      commit('SET_APPLICATION_LOADING', false);
      return data;
    },
    async fetchProduct({
      commit
    }, params) {
      const {
        data
      } = await this.$axios.get(`/product/${params || ""}`);
      console.log("fetchProduct", data);
      commit("SET_PRODUCTS", data.response);
      return data;
    },
    async fetchProfile({
      commit,
      state
    }) {
      try {
        const {
          data
        } = await this.$axios.get(`/account/me?token=${state.auth.access_token || ""}`);

        if (data.error) {

          commit("LOGOUT", qs.stringify({
            error_message: "Your account didn't exist anymore or might have been deleted!"
          }));

          console.error("Error loading profile!");
          return null;
        }

        console.log("fetchProfile", data);

        commit("SET_AUTH_USER", data.response);

        return data;

      } catch (e) {

        this.$router.push("/login");

        return null;
      }
    },
    async fetchCustomer({
      commit,
      state
    }) {
      const {
        data
      } = await this.$axios.get(`/customer/?token=${state.auth.access_token || ""}`);
      console.log("fetchCustomer", data);
      commit("SET_CUSTOMERS", data.response);
      return data;
    },
    async fetchMember({
      commit,
      state
    }) {
      const {
        data
      } = await this.$axios.get(`/account/?token=${state.auth.access_token || ""}`);
      console.log("fetchMember", data);
      commit("SET_MEMBERS", data.response);
      return data;
    },
    async fetchRole({
      commit,
      state
    }) {
      const {
        data
      } = await this.$axios.get(`/role/`);
      commit("SET_ROLES", data.response);
      console.log("fetchRole", data)
      return data;
    },
    async fetchCategory({
      commit,
      state
    }) {
      const {
        data
      } = await this.$axios.get(`/category/?token=${state.auth.access_token || ""}`);
      commit("SET_CATEGORIES", data.response);
      console.log("fetchCategory", data)
      return data;
    },
    async fetch({
      dispatch,
      commit
    }) {
      await Promise.all([
        dispatch("fetchProfile"),
        dispatch("fetchMember"),
        dispatch("fetchCustomer"),
        dispatch("fetchProduct"),
        dispatch("fetchCategory"),
        dispatch("fetchRole")
      ]);
      console.log("Done fetching all.");
    },
    async deleteCustomer({
      state,
      dispatch
    }, id) {
      await dispatch("delete", {
        repository: "customer",
        id
      });
      return data;
    },
    async deleteProduct({
      state,
      commit
    }, id) {
      commit("SET_APPLICATION_LOADING", true);
      const {
        data
      } = await this.$axios.delete(`/product/${id}?token=${state.auth.access_token}`);
      commit("SET_APPLICATION_LOADING", false);
      return data;
    },
    async delete({
      state
    }, {
      repository,
      id
    }) {
      const {
        data
      } = await this.$axios.post(`http://localhost:8080/${repository}/${id}?token=${state.auth.access_token}`);
      console.log(`delete${repository}`, data);
      return data;
    },
    async insertMember({
      state
    }, params) {
      const {
        data
      } = await this.$axios.post(`/customer/?${qs.stringify(params)}&token=${state.auth.access_token}`);
      console.log(`insertCustomer`, data);
    },
    async insertProduct({
      state,
    }, params) {
      const {
        data
      } = await this.$axios.post(`/product/?${qs.stringify(params)}&token=${state.auth.access_token}`);

      console.log(`insertProduct`, data);
      return data;
    },
    async updateProduct({
      state,
    }, {
      params,
      id
    }) {
      const {
        data
      } = await this.$axios.put(`/product/${id}?${qs.stringify(params)}&token=${state.auth.access_token}`);

      console.log(`updateProduct`, data);
      return data;
    },
    async updateAccount({
      state
    }, {
      params,
      id
    }) {
      const {
        data
      } = await this.$axios.put(`/account/${id}?${qs.stringify(params)}&token=${state.auth.access_token}`);

      console.log(`updateAccount`, data);
      return data;
    },
    async upload(state, payload) {
      const {
        data
      } = await this.$axios.post(`/upload&token=${state.auth.access_token}`);
      console.log(`uploadComplete`, data);
    }
  }
});

export default createStore;
