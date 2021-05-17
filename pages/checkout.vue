<template>
  <v-layout row>
    <v-flex md8>
      <VFilterNew class="mt-1" />
      <VTableNew
        class="mt-1"
        style="
          height: calc(100vh - 120px);
          overflow-y: auto;
          overflow-x: hidden;
        "
      />
    </v-flex>
    <v-flex md4 class="pl-2">
      <VCheckOut />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import qs from "qs";
import { nanoid } from "nanoid";

export default {
  middleware: ["auth"],
  transition: "slide-bottom",
  components: {
    VTableNew: () => import("~/components/checkout/LeftSide/VTableNew"),
    VFilterNew: () => import("~/components/checkout/LeftSide/VFilterNew"),
    VCheckOut: () => import("~/components/checkout/RightSide/VCheckout"),
  },
  computed: {
    ...mapFields([
      "products",
      "header",
      "carts",
      "checkout.categories",
      "application",
    ]),
  },
  async mounted() {
    this.header = "Checkout";
    if (typeof this.$route.query.trans_id === "undefined") {
      this.$router.push(`/checkout?${qs.stringify({ trans_id: nanoid(21) })}`);
    }
    this.castUrl = `/monitor?${qs.stringify({
      trans_id: this.$route.query.trans_id,
    })})}`;
    this.application.appbar = false;
  },
};
</script>
