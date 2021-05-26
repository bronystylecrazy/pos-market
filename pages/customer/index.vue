<template>
  <v-card :loading="application.loading"><PTable /></v-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  middleware: ["auth", "admin", "superadmin"],
  transition: "slide-bottom",
  components: {
    PTable: () => import("~/components/customer/PTable"),
  },
  data() {
    return {};
  },
  computed: {
    ...mapFields(["products", "header", "application"]),
  },
  async mounted() {
    this.header = "Manage Customer";
    this.application.appbar = true;
    this.application.loading = true;
    await this.$store.dispatch("fetch");
    this.application.loading = false;
  },
};
</script>

<style lang="scss" scoped>
</style>
