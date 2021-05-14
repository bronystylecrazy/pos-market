<template>
  <v-layout row>
    <v-flex md8>
      <VFilterNew class="mt-1" />
      <VTableNew
        class="mt-1"
        style="
          height: calc(100vh - 120px);
          overflow-y: auto;
          overflow-x: hidden;
        "
      />
    </v-flex>
    <v-flex md4 class="pl-2">
      <VCheckOut />
    </v-flex>
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
    VCheckOut: () => import("~/components/checkout/RightSide/VCheckout"),
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
