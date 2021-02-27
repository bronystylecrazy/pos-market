<template>
  <div class="container">
    <vs-row style="margin-top: 1.5em">
      <vs-col w="8"> <VLeftSection :items="items" /> </vs-col>
      <vs-col w="4"><VRightSection :items="carts" /></vs-col>
    </vs-row>
  </div>
</template>
≤
<script>
import { mapGetters } from "vuex";

export default {
  components: {
    VLeftSection: () => import("~/components/checkout/VLeftSection.vue"),
    VRightSection: () => import("~/components/checkout/VRightSection.vue"),
  },
  data() {},
  computed: {
    ...mapGetters(["carts"]),
  },
  async asyncData(ctx) {
    const { data } = await ctx.$axios.get("https://fakestoreapi.com/products");
    return {
      items: data,
    };
  },
};
</script>