<template>
  <div>
    <Hello />
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  components: {
    Hello: () => import("~/components/product/PTable"),
  },
  computed: {
    ...mapFields(["products", "header"]),
  },
  created() {
    this.header = "Manage products";
  },
};
</script>
