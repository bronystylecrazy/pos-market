<template>
  <v-btn class="api-view" small @click="application.api = true">
    <v-icon left>mdi-apache-kafka</v-icon> API
  </v-btn>
</template>

<script>
import { mapFields } from "~/node_modules/vuex-map-fields";
export default {
  props: {
    apis: {
      type: Array,
      default: new Array(),
    },
  },
  components: {
    Dialog: () => import("./Dialog"),
  },
  data() {
    return { show: false };
  },
  computed: {
    ...mapFields(["application"]),
  },
};
</script>

<style>
.api-view {
  position: fixed;
  top: 1rem;
  right: 1rem;
}
</style>
