<template>
  <v-layout row justify-center>
    <v-flex sm12 md8>
      <GrossSale />
    </v-flex>
  </v-layout>
</template>


<script>
import { mapFields } from "vuex-map-fields";

export default {
  transition: "slide-bottom",
  components: {
    GrossSale: () => import("~/components/dashboard/GrossSale"),
  },
  computed: {
    ...mapFields(["products", "header"]),
  },
  created() {
    this.header = "Dashboard";
  },
};
</script>
