<template>
  <v-toolbar dark color="rgb(29, 34, 40)" flat rounded="" class="mb-2">
    <v-text-field
      v-model="checkout.payment.customer"
      clearable
      flat
      solo-inverted
      dense
      hide-details
      prepend-inner-icon="mdi-account-cash"
      label="Customer"
    ></v-text-field>
    <v-spacer></v-spacer>
    <v-text-field
      v-model="checkout.payment.search"
      clearable
      flat
      solo-inverted
      dense
      hide-details
      prepend-inner-icon="mdi-barcode"
      label="Search"
    ></v-text-field>
  </v-toolbar>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  computed: {
    ...mapFields(["products", "checkout"]),
  },
};
</script>

<style lang="scss" scoped>
</style>