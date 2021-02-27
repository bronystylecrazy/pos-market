<template>
  <vs-card type="4" class="pa-4" @click="$store.dispatch('addToCart', item)">
    <template #title>
      <h3>{{ title }}</h3>
    </template>
    <template #img>
      <img :src="image" alt="" style="height: 150px" />
    </template>
    <template #text>
      <!-- <p>{{ description }}</p> -->
    </template>
    <template #interactions>
      <vs-button danger icon>
        <i class="bx bx-heart"></i>
      </vs-button>
      <vs-button class="btn-chat" shadow primary>
        <i class="bx bx-chat"></i>
        <span class="span"> {{ price }} $ </span>
      </vs-button>
    </template>
  </vs-card>
</template>

<script>
export default {
  props: {
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    item: Object,
  },
};
</script>