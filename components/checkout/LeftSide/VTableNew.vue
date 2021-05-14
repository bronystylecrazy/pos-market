<template>
  <v-layout row>
    <v-flex
      xs12
      sm6
      md4
      v-for="product in products"
      :key="product.productid"
      class="pa-3"
    >
      <PCard :item="product" />
    </v-flex>
    <v-flex md12 class="px-3" v-if="products.length <= 0">
      <v-alert icon="mdi-cube" prominent text type="info">
        <v-row align="center">
          <v-col class="grow">
            <b
              >Oh, no... Hey, {{ auth.user.first_name }}
              {{ auth.user.last_name }}</b
            ><br />
            If you want more product, please insert it to your system :).
          </v-col>
          <v-col class="shrink">
            <v-btn @click="$router.push('/product')"
              ><v-icon left>mdi-cube-send</v-icon>Manage product</v-btn
            >
          </v-col>
        </v-row>
      </v-alert>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  components: {
    PCard: () => import("~/components/product/PCard"),
  },
  computed: {
    ...mapFields([
      "products",
      "header",
      "categories",
      "checkout",
      "application",
      "auth",
    ]),
  },
};
</script>
