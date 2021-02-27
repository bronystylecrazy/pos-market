<template>
  <vs-row>
    <vs-col w="2" v-for="item in items" :key="item.id" style="padding: 10px">
      <VCard
        :title="item.title"
        :image="item.image"
        :description="item.description"
        :price="item.price"
        :item="item"
      />
    </vs-col>
  </vs-row>
</template>

<script>
export default {
  components: {
    VCard: () => import("~/components/checkout/VCard.vue"),
  },
  props: {
    items: Array,
  },
};
</script>