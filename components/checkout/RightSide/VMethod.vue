<template>
  <v-layout row class="px-3 my-2" justify-center>
    <v-flex md12 class="ma-0 pa-0">
      <v-card
        dark
        color="rgb(29, 34, 40)"
        class="ma-0 elevation-0 cshadow text-center py-10"
        justify-center
        ><v-btn
          class="font-weight-bold"
          color="rgba(255,255,255,.05)"
          elevation="0"
        >
          SUBTOTAL {{ subtotal }} $</v-btn
        >
        <v-btn class="font-weight-bold" color="teal" dark flat
          ><v-icon left>mdi-cash-multiple</v-icon>Purchase</v-btn
        ></v-card
      >
    </v-flex>
  </v-layout>
</template>

<script>
import { mapFields } from "vuex-map-fields";
export default {
  computed: {
    ...mapFields(["products", "checkout", "carts"]),
    subtotal() {
      let subtotal = 0;
      for (var c of this.carts) {
        subtotal += c.price * c.quantity;
      }
      return subtotal.toFixed(2);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>