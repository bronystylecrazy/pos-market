<template>
  <v-layout row style="align-content: start">
    <v-flex
      xs12
      sm6
      md4
      v-for="product in products"
      :key="product.productid"
      class="pa-3"
    >
      <PCard
        :item="product"
        v-ripple
        class="no_selection"
        style="cursor: pointer"
        @onClick="addToCart(product)"
      />
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
import { mapGetters } from "vuex";

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
      "realtime.stompClient",
    ]),
    ...mapGetters(["serializeCheckout"]),
  },
  methods: {
    addToCart(item, amount = 1) {
      const buyingProduct = this.products.find(
        (product) => product.id === item.id
      );

      if (typeof buyingProduct === "undefined" || buyingProduct == null) return;
      let completeAmount = 0;
      for (var i = 0; i < amount; i++) {
        if (buyingProduct.stock >= 1) {
          this.checkout.carts.push(item);
          buyingProduct.stock -= 1;
          completeAmount++;
        }
      }
      let payload = this.toBinary(
        JSON.stringify([
          ...this.serializeCheckout.map(({ id, stock, buy }) => ({
            id,
            stock,
            buy,
          })),
        ])
      );

      this.stompClient.send(
        "/app/checkout",
        JSON.stringify({
          from: this.auth.user.memid,
          payload,
        })
      );

      return completeAmount;
    },
    toBinary(str) {
      return btoa(
        encodeURIComponent(str).replace(
          /%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode("0x" + p1);
          }
        )
      );
    },
  },
};
</script>
