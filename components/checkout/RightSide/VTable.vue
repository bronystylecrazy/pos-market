<template>
  <v-simple-table style="box-shadow: 0 0 1px 0 rgb(0 0 0 / 10%)">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-center black--text font-weight-bold">#id</th>
          <th class="text-left">Picture</th>
          <th class="text-left">Name</th>
          <th class="text-left">Quantity</th>
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
            <v-avatar color="primary" size="32">
              <img
                :src="`https://avatars.dicebear.com/api/jdenticon/${product.title}.svg`"
                alt="John"
            /></v-avatar>
          </td>
          <td>{{ product.title }}</td>
          <td class="text-center">
            <v-text-field
              placeholder="Placeholder"
              v-model="product.quantity"
              class="d-inline-block"
              style="width: 50px"
              @keyup.up="product.quantity++"
              @keyup.down="product.quantity--"
              type="number"
            ></v-text-field>
          </td>
          <td class="text-center font-weight-bold">
            {{ (product.quantity * product.price).toFixed(2) }}$
            <!-- <b style="font-size: 10px"
              >({{ product.quantity }} x {{ product.price }})</b
            > -->
          </td>
          <td>
            <v-btn
              class="font-weight-bold white--text"
              color="deep-orange accent-3"
              small
              @click="deleteFromCart(product)"
              ><v-icon>mdi-trash-can</v-icon></v-btn
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
      return this.carts;
    },
  },
  methods: {
    deleteFromCart(product) {
      var arr = [];
      for (var p of this.carts) {
        if (p.id !== product.id) arr.push(p);
      }
      this.carts = arr;
      this.$store.dispatch("up");
    },
  },
};
</script>