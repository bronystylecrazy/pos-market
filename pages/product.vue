<template>
  <div>
    <v-tabs
      dark
      show-arrows
      v-model="tab"
      style="border-radius: 5px 5px 0px 0px; background: rgb(29, 34, 40)"
    >
      <v-tabs-slider color="teal lighten-3"></v-tabs-slider>
      <v-tab v-for="category in categories" :key="category">{{
        category
      }}</v-tab>
    </v-tabs>
    <Hello :tab="tab" />
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  transition: "slide-bottom",
  components: {
    Hello: () => import("~/components/product/PTable"),
  },
  computed: {
    ...mapFields(["products", "header", "checkout"]),
    categories() {
      const __ = [...this.checkout.categories];
      __.unshift("ALL");
      return __;
    },
  },
  created() {
    this.header = "Manage products";
  },
  data() {
    return {
      tab: "",
    };
  },
};
</script>
