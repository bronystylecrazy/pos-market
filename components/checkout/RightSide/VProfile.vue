<template>
  <div class="customer-profile">
    <v-list class="mb-2">
      <v-list-item>
        <v-list-item-avatar>
          <v-img
            :src="`https://avatars.dicebear.com/api/avataaars/${checkout.customerProfile.displayName}.svg`"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            v-text="checkout.customerProfile.displayName"
          ></v-list-item-title>

          <v-list-item-subtitle
            v-text="checkout.customerProfile.customerID"
          ></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon>
            <v-icon
              color="grey lighten-1"
              @click="
                checkout.customerProfile.show = !checkout.customerProfile.show
              "
              >mdi-information</v-icon
            >
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-layout row class="pa-3" v-if="checkout.customerProfile.show">
      <v-flex md4
        ><v-list class="mb-2">
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>mdi-store</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-subtitle v-text="`Store`"></v-list-item-subtitle>
              <v-list-item-title
                v-text="checkout.customerProfile.store.toFixed(2)"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item> </v-list
      ></v-flex>
      <v-flex md4 class="pl-2"
        ><v-list class="mb-2">
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>mdi-medal</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-subtitle v-text="`Reward`"></v-list-item-subtitle>
              <v-list-item-title
                v-text="checkout.customerProfile.reward"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item> </v-list
      ></v-flex>
      <v-flex md4 class="pl-2"
        ><v-list class="mb-2">
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>mdi-poll-box</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-subtitle v-text="`Visit`"></v-list-item-subtitle>
              <v-list-item-title
                v-text="checkout.customerProfile.visit"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item> </v-list
      ></v-flex>
    </v-layout>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
export default {
  computed: {
    ...mapFields(["products", "checkout", "carts"]),
  },
};
</script>

<style lang="scss" scoped>
</style>