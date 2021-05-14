<template>
  <v-navigation-drawer
    app
    dark
    permanent
    expand-on-hover
    color="rgb(29, 34, 40)"
  >
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img :src="`${auth.user.image}`"></v-img>
        </v-list-item-avatar>
      </v-list-item>

      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="title">
            {{ auth.user.first_name }} {{ auth.user.last_name }}
          </v-list-item-title>
          <v-list-item-subtitle>{{ auth.user.roles }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item
        link
        :to="menu.to"
        v-for="menu in menus"
        :class="`custom-${menu.color}`"
        :key="menu.title + menu.to"
      >
        <v-list-item-icon
          ><v-icon>{{ menu.icon }}</v-icon></v-list-item-icon
        >
        <v-list-item-title class="font-weight-bold">{{
          menu.title
        }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <!-- <div class="pa-2">
        <v-btn block color="red" dark @click="logout">
          <v-icon left>mdi-logout</v-icon> Logout
        </v-btn>
      </div> -->
      <v-list nav dense>
        <v-list-item link class="red" dark @click="logout">
          <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
          <v-list-item-title class="font-weight-bold">Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { schema } from "~/store/models/members";
export default {
  data() {
    return {
      menus: [
        {
          title: "Dashboard",
          icon: "mdi-view-dashboard",
          to: "/",
          color: "primary",
        },
        {
          title: "Checkout",
          icon: "mdi-cash-register",
          to: "/checkout",
          color: "green",
        },
        {
          title: "Manage Product",
          icon: "mdi-cube",
          to: "/product",
          color: "orange",
        },
        {
          title: "Manage Customer",
          icon: "mdi-account-group",
          to: "/customer",
          color: "gray",
        },
        {
          title: "Manage Member",
          icon: "mdi-account-supervisor-circle-outline",
          to: "/member",
          color: "gray",
        },
        {
          title: "Account setting",
          icon: "mdi-account-cog",
          to: "/me",
          color: "gray",
        },
      ],
    };
  },
  computed: {
    ...mapFields(["auth"]),
  },
  methods: {
    logout() {
      this.auth.isLoggedIn = false;
      this.auth.user = {};
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style>
.v-list-item--active.custom-primary {
  box-shadow: 0 10px 20px -10px rgba(26, 92, 255, 0.5);
  background-color: rgb(26, 92, 255);
  background-image: linear-gradient(
    43deg,
    #4158d0 0%,
    #c850c0 46%,
    #ffcc70 100%
  );
}

.v-list-item--active.custom-green {
  box-shadow: 0 10px 20px -10px rgba(26, 255, 217, 0.5);
  background-color: rgb(70, 201, 58);
  background-image: linear-gradient(
    45deg,
    #fa8bff 0%,
    #2bd2ff 52%,
    #2bff88 90%
  );
}

.v-navigation-drawer__border {
  opacity: 0;
}
</style>
