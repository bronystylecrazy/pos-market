<template>
  <v-layout row justify-center>
    <v-flex md6><VTable :items="syncCarts" /></v-flex>
    <v-flex md4 class="pl-4"><VTable :items="syncCarts" /></v-flex>
  </v-layout>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  components: {
    VTable: () => import("~/components/monitor/VTable"),
  },
  computed: {
    ...mapFields([
      "header",
      "products",
      "checkout",
      "realtime.stompClient",
      "application",
    ]),
    syncCarts() {
      return this.checkout.monitorCarts
        .map((item) => {
          const fetchProduct = this.products.find((p) => p.id === item.id);
          return {
            ...fetchProduct,
            buy: item.buy,
            newStock: item.stock,
          };
        })
        .filter((p) => !!p.id);
    },
  },
  async created() {
    this.header = "Monitor";
    this.header = "Manage Member";
    this.application.appbar = true;
    this.application.loading = true;
    await this.$store.dispatch("fetch");
    this.application.loading = false;
  },
};
</script>
