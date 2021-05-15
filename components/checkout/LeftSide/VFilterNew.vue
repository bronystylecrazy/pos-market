<template>
  <v-toolbar dark color="rgb(29, 34, 40)" flat class="rounded">
    <v-toolbar-title class="title mr-6 hidden-sm-and-down">
      <b>Point Of Sale</b> Checkout
    </v-toolbar-title>
    <!-- <v-divider vertical></v-divider> -->
    <v-spacer></v-spacer>
    <v-autocomplete
      light
      v-model="model"
      :items="items"
      :loading="isLoading"
      :search-input.sync="search"
      clearable
      hide-details
      hide-selected
      item-text="title"
      item-value="title"
      label="Search for a product"
      solo
      flat
      class="ml-10"
      style="width: 200px"
      dense
    >
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            Search for
            <strong>Pos-Market product</strong>
          </v-list-item-title>
        </v-list-item>
      </template>
      <template v-slot:selection="{ attr, on, item, selected }">
        <v-chip
          v-bind="attr"
          :input-value="selected"
          color="blue-grey"
          class="white--text"
          v-on="on"
        >
          <v-icon left> mdi-bitcoin </v-icon>
          <span v-text="item.title"></span>
        </v-chip>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-avatar
          color="indigo"
          class="headline font-weight-light white--text"
          :disabled="item.stock <= 0"
        >
          <v-img :src="item.image"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            ><b>{{ item.title }}</b></v-list-item-title
          >
          <v-list-item-subtitle>
            <v-chip
              label
              x-small
              color="#fbbd08"
              dark
              flat
              style="width: 50px"
              class="text-center"
              >$ {{ item.price }}</v-chip
            >
            <v-chip
              label
              x-small
              color="#db2828"
              dark
              flat
              v-if="item.stock <= 0"
              ><b>Out of stock</b></v-chip
            >
            <v-chip v-else label x-small color="#b5cc18" dark flat
              ><b>Available</b></v-chip
            >
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
            text
            small
            v-for="icon in item.category.split(',')"
            :key="icon"
            v-if="!!categories.find((category) => category.name === icon)"
          >
            <v-icon class="grey--text text--darken-1">
              {{ categories.find((category) => category.name === icon).image }}
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </template>
    </v-autocomplete>
    <template v-slot:extension>
      <v-tabs
        v-model="checkout.category"
        color="blue-grey"
        slider-color="blue-grey"
        dark
      >
        <v-tab v-for="category in displayCategories" :key="category.name">
          <v-icon left>{{ category.image }}</v-icon>
          {{ category.name }}
        </v-tab>
      </v-tabs>
    </template>
  </v-toolbar>
</template>

<script>
import { mapFields } from "~/node_modules/vuex-map-fields";
export default {
  data: () => ({
    isLoading: false,
    items: [],
    model: null,
    search: null,
    tab: null,
  }),
  computed: {
    ...mapFields(["products", "categories", "auth", "checkout"]),
    displayCategories() {
      return [{ name: "All", image: "mdi-clipboard-list" }, ...this.categories];
    },
  },
  watch: {
    model(val) {
      if (val != null) this.tab = 0;
      else this.tab = null;
    },
    search(val) {
      // Items have already been loaded
      if (this.items.length > 0) return;

      this.isLoading = true;

      this.$axios
        .get(`/product/?token=${this.auth.access_token}`)
        .then(({ data }) => {
          console.log(data);
          this.items = data.response;
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>
