<template>
  <div><PTable /></div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  middleware: ["auth"],
  transition: "slide-bottom",
  components: {
    PTable: () => import("~/components/customer/PTable"),
  },
  computed: {
    ...mapFields(["products", "header"]),
  },
  created() {
    this.header = "Manage Customer";
  },
};
</script>

<style lang="scss" scoped>
</style>