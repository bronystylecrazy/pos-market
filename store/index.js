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
  paths: ["auth", "application.setting", "realtime.badges", "members",
    "roles",
    "products",
    "customers",
    "categories",
    "orders",
  ],
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
    orders: [],
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

      },
      category: 0
    },
    auth: {
      user: {

      },
      isLoggedIn: false,
      access_token: "",
      username: "",
      token_id: ""
    },
    application: {
      loading: true,
      websocket: false,
      setting: {
        realtime_notify: true,
        console_log: true
      },
      appbar: true,
      api: false
    },
    realtime: {
      socket: null,
      stompClient: null,
      badges: {
        "/customer": 0,
        "/member": 0,
        "/product": 0,
        "/orders": 0
      },
      online: {}
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
    SET_ORDERS(state, orders) {
      state.orders = orders;
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
      this.$axios.post(`/account/${state.auth.token_id}/logout?token=${state.auth.access_token}`).then(({
        data
      }) => {
        if (data.error) return;
        localStorage.clear();
        state.auth.isLoggedIn = false;
        state.auth.user = {};
        this.$router.push(`/login${typeof qs === "undefined" ? "" : "?"+qs}`);
      });
    },
    SET_ONLINE(state, status) {
      state.realtime.online = status;
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
    async fetchOnline({
      state,
      commit
    }) {
      const {
        data
      } = await this.$axios.get(`/account/status?token=${state.auth.access_token}`);
      commit("SET_ONLINE", data.response || {});
      return data;
    },
    async deleteAccount({
      state
    }, uid) {
      if (state.application.setting.console_log)
        console.log("deleteAccount", uid)
      const {
        data
      } = await this.$axios.delete(`/account/${uid}?token=${state.auth.access_token}`);
      return data;
    },
    async fetchOverview({
      commit,
      state
    }) {
      commit("SET_DASHBOARD_OVERVIEW", {
        productInStock: Math.max(0, state.dashboard.overview.productInStock - 1),
        grossSales: Math.max(state.dashboard.overview.grossSales - 1),
        productSales: Math.max(state.dashboard.overview.productSales - 1),
        customers: Math.max(state.dashboard.overview.customers - 1)
      });
      const {
        data
      } = await this.$axios.get(`/transaction/overview`);
      commit("SET_DASHBOARD_OVERVIEW", data.response);
      if (state.application.setting.console_log)
        console.log("fetchOverview", data);
      return data;
    },
    async fetchHistory({
      state,
      commit
    }) {
      const {
        data
      } = await this.$axios.get(`/customer-history/?token=${state.auth.access_token}`);
      commit("SET_ORDERS", data.response);
      return data;
    },
    async fetchProduct({
      commit,
      state
    }, params) {
      const {
        data
      } = await this.$axios.get(`/product/${params || ""}`);
      if (state.application.setting.console_log)
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
        } = await this.$axios.get(`/account/me?token=${state.auth.access_token}`);

        if (data.error) {

          commit("LOGOUT", qs.stringify({
            error_message: "Your account didn't exist anymore or might have been deleted!"
          }));

          console.error("Error loading profile!");
          return null;
        }
        if (state.application.setting.console_log)
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
      } = await this.$axios.get(`/customer/?token=${state.auth.access_token}`);
      if (state.application.setting.console_log)
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
      } = await this.$axios.get(`/account/?token=${state.auth.access_token}`);
      if (state.application.setting.console_log)
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
      if (state.application.setting.console_log)
        console.log("fetchRole", data)
      return data;
    },
    async fetchCategory({
      commit,
      state
    }) {
      const {
        data
      } = await this.$axios.get(`/category/?token=${state.auth.access_token}`);
      commit("SET_CATEGORIES", data.response);
      if (state.application.setting.console_log)
        console.log("fetchCategory", data)
      return data;
    },
    async fetch({
      dispatch,
      commit,
      state
    }) {
      await Promise.all([
        dispatch("fetchProfile"),
        dispatch("fetchMember"),
        dispatch("fetchCustomer"),
        dispatch("fetchProduct"),
        dispatch("fetchCategory"),
        dispatch("fetchRole"),
        dispatch("fetchOnline"),
        dispatch("fetchOverview")
      ]);
      if (state.application.setting.console_log)
        console.log("Done fetching all.");
    },
    async deleteCustomer({
      state,
      dispatch
    }, id) {
      const {
        data
      } = await this.$axios.delete(`/customer/${id}?token=${state.auth.access_token}`);
      if (state.application.setting.console_log)
        console.log("deleteCustomer", data);
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
      if (state.application.setting.console_log)
        console.log(`delete${repository}`, data);
      return data;
    },
    async insertMember({
      state
    }, params) {
      const {
        data
      } = await this.$axios.post(`/customer/?${qs.stringify(params)}&token=${state.auth.access_token}`);
      if (state.application.setting.console_log)
        console.log(`insertCustomer`, data);
    },
    async insertCustomer({
      state
    }, params) {
      const {
        data
      } = await this.$axios.post(`/customer/?${qs.stringify(params)}&token=${state.auth.access_token}`);
      if (state.application.setting.console_log)
        console.log("insertCustomer", data);
      return data;
    },
    async insertProduct({
      state,
    }, params) {
      const {
        data
      } = await this.$axios.post(`/product/?${qs.stringify(params)}&token=${state.auth.access_token}`);
      if (state.application.setting.console_log)
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
      if (state.application.setting.console_log)
        console.log(`updateProduct`, data);
      return data;
    },
    async updateCustomer({
      state,
    }, {
      params,
      id
    }) {
      const {
        data
      } = await this.$axios.put(`/customer/${id}?${qs.stringify(params)}&token=${state.auth.access_token}`);
      if (state.application.setting.console_log)
        console.log(`updateCustomer`, data);
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
      if (state.application.setting.console_log)
        console.log(`updateAccount`, data);
      return data;
    },
    async upload(state, payload) {
      const {
        data
      } = await this.$axios.post(`/upload&token=${state.auth.access_token}`);
      if (state.application.setting.console_log)
        console.log(`uploadComplete`, data);
    }
  }
});

export default createStore;
