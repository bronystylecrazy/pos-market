<template>
  <v-layout row class="mt-1">
    <v-flex md8 class="px-2">
      <VFilterNew />
      <VTableNew class="mt-3" />
    </v-flex>
    <v-flex md4 class="pl-2"></v-flex>
  </v-layout>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  middleware: ["auth"],
  transition: "slide-bottom",
  components: {
    VTableNew: () => import("~/components/checkout/LeftSide/VTableNew"),
    VFilterNew: () => import("~/components/checkout/LeftSide/VFilterNew"),
  },
  computed: {
    ...mapFields([
      "products",
      "header",
      "carts",
      "checkout.categories",
      "application",
    ]),
  },
  async created() {
    this.header = "Checkout";
    this.application.appbar = false;
    this.application.loading = true;
    await this.$store.dispatch("fetch");
    this.application.loading = false;
  },
};
</script>
