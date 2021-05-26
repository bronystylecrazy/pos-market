<template>
  <v-card :loading="application.loading"><PTable /> </v-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  middleware: ["auth", "superadmin"],
  transition: "slide-bottom",
  components: {
    PTable: () => import("~/components/member/PTable"),
  },
  computed: {
    ...mapFields(["products", "header", "application"]),
  },
  async mounted() {
    this.header = "Manage Member";
    this.application.appbar = true;
    this.application.loading = true;
    await this.$store.dispatch("fetch");
    this.application.loading = false;
  },
};
</script>

<style lang="scss" scoped>
</style>
