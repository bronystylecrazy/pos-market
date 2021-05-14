<template>
  <div>
    <!-- <v-tabs
      dark
      show-arrows
      v-model="tab"
      style="border-radius: 5px 5px 0px 0px; background: rgb(29, 34, 40)"
    >
      <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
      <v-tab v-for="category in categories" :key="category">{{
        category.name
      }}</v-tab>
    </v-tabs> -->
    <Hello :tab="tab" />
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  middleware: ["auth"],
  transition: "slide-bottom",
  components: {
    Hello: () => import("~/components/product/PTable"),
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
  async created() {
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
