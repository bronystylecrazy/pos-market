<template>
  <v-app-bar app tile flat color="transparent" hide-on-scroll>
    <v-toolbar-title class="grey--text"
      ><b>Point Of Sale</b> {{ header }}</v-toolbar-title
    >
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  computed: {
    ...mapFields(["header"]),
  },
};
</script>
