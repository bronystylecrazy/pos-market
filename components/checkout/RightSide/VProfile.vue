<template>
  <div class="customer-profile">
    <v-list class="mb-2">
      <v-list-item>
        <v-list-item-avatar>
          <v-img
            :src="`https://i.pravatar.cc/190?u=${myCustomer.image}`"
          ></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            v-text="`${myCustomer.firstName} ${myCustomer.lastName}`"
          ></v-list-item-title>

          <v-list-item-subtitle
            v-text="myCustomer.customerID"
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
                v-text="myCustomer.service.store.toFixed(2)"
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
                v-text="myCustomer.service.reward"
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
                v-text="myCustomer.service.visit"
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
    ...mapFields(["products", "checkout", "carts", "customers"]),
    myCustomer() {
      const customer = this.customers.filter(
        (customer) => customer.customerID === this.checkout.payment.customer
      );
      // this.checkout.customerProfile =
      return (
        customer[0] || {
          service: {
            visit: 0,
            store: 0,
            reward: 0,
          },
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
</style>