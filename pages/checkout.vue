<template>
  <v-layout row>
    <v-flex md8>
      <VLFilter />
      <VLTable />
    </v-flex>
    <v-flex md4 class="pl-2">
      <VRFilter />
      <VRProfile />
      <VRTable />
      <VMethod />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  transition: "slide-bottom",
  components: {
    VLTable: () => import("~/components/checkout/LeftSide/VTable"),
    VLFilter: () => import("~/components/checkout/LeftSide/VFilter"),
    VRFilter: () => import("~/components/checkout/RightSide/VFilter"),
    VRProfile: () => import("~/components/checkout/RightSide/VProfile"),
    VRTable: () => import("~/components/checkout/RightSide/VTable"),
    VMethod: () => import("~/components/checkout/RightSide/VMethod"),
  },
  computed: {
    ...mapFields(["products", "header", "carts", "checkout.categories"]),
  },
  created() {
    this.header = "Checkout";
  },
};
</script>
