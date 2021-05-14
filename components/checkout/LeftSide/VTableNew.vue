<template>
  <v-layout row>
    <v-flex sm12 md12 class="px-2"> </v-flex>
    <v-flex
      xs12
      sm6
      md4
      v-for="product in products"
      :key="product.productid"
      class="pa-2"
    >
      <PCard :item="product" />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  components: {
    PCard: () => import("~/components/product/PCard"),
  },
  computed: {
    ...mapFields([
      "products",
      "header",
      "categories",
      "checkout",
      "application",
      "auth",
    ]),
  },
};
</script>
