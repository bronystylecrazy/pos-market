<template>
  <v-simple-table style="box-shadow: 0 0 1px 0 rgb(0 0 0 / 10%)">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-center black--text font-weight-bold">#id</th>
          <th class="text-left">Picture</th>
          <th class="text-left">Name</th>
          <th class="text-left">Category</th>
          <th class="text-left">Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in filteredProduct" :key="product.title">
          <td class="text-center black--text font-weight-bold">
            {{ product.id }}
          </td>
          <td>
            <v-avatar size="32">
              <img
                :src="`https://avatars.dicebear.com/api/jdenticon/${product.image}.svg`"
                alt="John"
            /></v-avatar>
          </td>
          <td>{{ product.title }}</td>
          <td>{{ product.category }}</td>
          <td>{{ product.price.toFixed(2) }}$</td>
          <td>
            <v-btn
              class="font-weight-bold"
              color="primary"
              small
              @click="addToCart(product)"
              ><v-icon left>mdi-cart-plus</v-icon> Add</v-btn
            >
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapFields(["products", "checkout", "carts"]),
    filteredProduct() {
      return this.products.filter(
        (product) =>
          this.checkout.category.includes(product.category) &&
          !!this.checkout.category
      );
    },
  },
  methods: {
    addToCart(product) {
      for (var p of this.carts) {
        if (p.title === product.title) {
          p.quantity += 1;
          return;
        }
      }
      this.carts.push({
        quantity: 1,
        ...product,
      });
    },
  },
};
</script>