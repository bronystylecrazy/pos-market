<template>
  <v-toolbar dark color="rgb(29, 34, 40)" flat rounded="" class="mb-2">
    <v-text-field
      v-model="checkout.search"
      clearable
      flat
      solo-inverted
      dense
      hide-details
      prepend-inner-icon="mdi-magnify"
      label="Search"
    ></v-text-field>
    <template v-if="$vuetify.breakpoint.mdAndUp">
      <v-spacer></v-spacer>

      <v-select
        v-model="checkout.category"
        class="ml-2 nowrap"
        flat
        solo-inverted
        hide-details
        dense
        style="width: 50px"
        :items="checkout.categories"
        prepend-inner-icon="mdi-magnify"
        multiple
        label="Category"
      >
      </v-select>
      
    </template>
  </v-toolbar>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  computed: {
    ...mapFields(["products", "checkout", "toggle_exclusive"]),
  },
};
</script>

<style lang="scss" scoped>
</style>