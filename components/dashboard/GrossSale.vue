<template>
  <v-card elevation="0" class="cshadow">
    <v-card-title class="font-weight-bold">✨ Overview</v-card-title>
    <h3 class="text-center pt-4">Totals</h3>
    <h1 class="text-center py-0 pt-3 font-weight-bold display-2">
      $
      {{
        tweenedGrossSales
          .toFixed()
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }}
    </h1>
    <h2 class="text-center pb-8 grey--text heading-5">
      <v-icon>mdi-cube</v-icon> Gross Sales
    </h2>
    <v-divider></v-divider>
    <v-row>
      <v-col md="4">
        <h3 class="text-center pt-4">Totals</h3>
        <h1 class="text-center py-0 pt-3 font-weight-bold display-2">
          {{
            Number.parseInt(tweenedProductSales)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }}
        </h1>
        <h2 class="text-center pb-8 grey--text heading-5">
          <v-icon>mdi-cube-send</v-icon> Products Sale
        </h2>
      </v-col>
      <v-col md="4">
        <h3 class="text-center pt-4">Totals</h3>
        <h1 class="text-center py-0 pt-3 font-weight-bold display-2">
          {{
            Number.parseInt(tweenedProductInStock)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }}
        </h1>
        <h2 class="text-center pb-8 grey--text heading-5">
          <v-icon>mdi-cube-scan</v-icon> Product in stock
        </h2>
      </v-col>
      <v-col md="4">
        <h3 class="text-center pt-4">Totals</h3>
        <h1 class="text-center py-0 pt-3 font-weight-bold display-2">
          {{
            Number.parseInt(tweenedCustomers)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }}
        </h1>
        <h2 class="text-center pb-8 grey--text heading-5">
          <v-icon>mdi-clipboard-account-outline</v-icon> Customers
        </h2>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col md="4" sm="12" class="px-8">
        <v-btn block tile color="primary" @click="$router.push('/orders')"
          ><v-icon left>mdi-printer</v-icon>See orders</v-btn
        >
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import gsap from "gsap";

export default {
  data() {
    return {
      tweenedProductInStock: 0,
      tweenedGrossSales: 0,
      tweenedProductSales: 0,
      tweenedCustomers: 0,
    };
  },
  computed: {
    ...mapFields([
      "dashboard.overview",
      "dashboard.overview.productInStock",
      "dashboard.overview.grossSales",
      "dashboard.overview.productSales",
      "dashboard.overview.customers",
      "application",
    ]),
  },
  methods: {
    printReport() {
      this.$swal(
        "This method is in process!",
        "It will be finished as soon as possible!",
        "info"
      );
    },
  },
  watch: {
    grossSales: function (newValue) {
      gsap.to(this.$data, { duration: 1.5, tweenedGrossSales: newValue });
    },
    productInStock: function (newValue) {
      gsap.to(this.$data, { duration: 1.5, tweenedProductInStock: newValue });
    },
    productSales: function (newValue) {
      gsap.to(this.$data, { duration: 1.5, tweenedProductSales: newValue });
    },
    customers: function (newValue) {
      gsap.to(this.$data, { duration: 1.5, tweenedCustomers: newValue });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
