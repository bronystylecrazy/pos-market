<template>
  <div>
    <PTable :tab="tab" />
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  middleware: ["auth"],
  transition: "slide-bottom",
  components: {
    PTable: () => import("~/components/product/PTable"),
  },
  computed: {
    ...mapFields([
      "products",
      "header",
      "checkout",
      "categories",
      "application",
    ]),
  },
  async mounted() {
    this.header = "Manage Product";
    this.application.appbar = true;

    this.application.loading = true;
    await this.$store.dispatch("fetch");
    this.application.loading = false;
  },
  data() {
    return {
      tab: 0,
    };
  },
};
</script>
