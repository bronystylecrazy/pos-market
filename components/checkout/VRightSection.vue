<template>
  <div>
    <h2 style="color: white">Checkout</h2>
    <div style="width: 100%">
      <VTable :items="items" />
    </div>
    <vs-button gradient>Submit</vs-button>
  </div>
</template>

<script>
export default {
  components: {
    VTable: () => import("~/components/checkout/VTable.vue"),
  },
  props: {
    items: Array,
  },
};
</script>