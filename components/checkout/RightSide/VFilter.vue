<template>
  <div>
    <v-toolbar dark color="rgb(29, 34, 40)" flat rounded="" class="mb-2">
      <!-- <v-text-field
        clearable
        flat
        solo-inverted
        dense
        hide-details
        label="Customer"
      ></v-text-field> -->
      <v-autocomplete
        label="Search for customerID"
        v-model="checkout.payment.customer"
        :items="filteredCustomerID"
        solo-inverted
        flat
        hide-no-data
        hide-details
        prepend-inner-icon="mdi-account-cash"
        dense
        item-text="customerID"
        item-value="customerID"
      >
        <template #item="data">
          <v-list-item-avatar>
            <img :src="`https://i.pravatar.cc/190?u=${data.item.image}`" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              v-html="`${data.item.firstName} ${data.item.lastName}`"
            ></v-list-item-title>
            <v-list-item-subtitle
              v-html="data.item.customerID"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </template>
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>
              Search for your
              <strong>Customer</strong>
            </v-list-item-title>
          </v-list-item>
        </template></v-autocomplete
      >
      <v-spacer></v-spacer>
      <!-- <v-text-field
        class="ml-2"
        v-model="checkout.payment.search"
        clearable
        flat
        solo-inverted
        dense
        hide-details
        prepend-inner-icon="mdi-barcode"
        label="Search"
      ></v-text-field> -->
      <v-autocomplete
        label="Search for product"
        class="ml-2"
        v-model="checkout.payment.search"
        :items="filteredProducts"
        solo-inverted
        flat
        hide-no-data
        hide-details
        item-text="title"
        item-value="productID"
        prepend-inner-icon="mdi-barcode"
        dense
        @change="selectProduct"
      >
        <template #item="data">
          <v-list-item-avatar>
            <img
              :src="`https://avatars.dicebear.com/api/jdenticon/${data.item.image}.svg`"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="data.item.title"></v-list-item-title>
            <v-list-item-subtitle
              v-html="data.item.productID"
            ></v-list-item-subtitle>
          </v-list-item-content>
        </template>

        <template #no-data>
          <v-list-item>
            <v-list-item-title>
              Search for your
              <strong>Product</strong>
            </v-list-item-title>
          </v-list-item>
        </template>

        ></v-autocomplete
      >
    </v-toolbar>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  computed: {
    ...mapFields(["products", "checkout", "customers", "carts"]),
    filteredCustomerID() {
      return this.customers.map((customer) => customer);
    },
    filteredProducts() {
      return this.products.map((product) => product);
    },
  },
  methods: {
    selectProduct(productID) {
      this.addToCart(productID);
    },
    addToCart(productID) {
      for (var p of this.carts) {
        if (p.productID === productID) {
          p.quantity += 1;
          this.checkout.payment.search = "";
          return;
        }
      }
      this.carts.push({
        quantity: 1,
        ...this.products.filter((p) => p.productID === productID)[0],
      });
      this.checkout.payment.search = "";
    },
  },
};
</script>

<style lang="scss" scoped>
</style>