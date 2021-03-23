<template>
  <div class="checkout">
    <VTable />
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  components: {
    VTable: () => import("~/components/checkout/VTable"),
  },
  computed: {
    ...mapFields(["products", "header"]),
  },
  created() {
    this.header = "Checkout";
  },
};
</script>
