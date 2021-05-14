<template>
  <v-card elevation="0" class="cshadow">
    <v-card-title class="font-weight-bold">✨ Today</v-card-title>
    <h3 class="text-center pt-4">Totals</h3>
    <h1 class="text-center py-0 pt-3 font-weight-bold display-2">
      <!-- $ {{ dashboard.grossSale.toFixed(2) }} -->
    </h1>
    <h2 class="text-center pb-8 grey--text heading-5">
      <v-icon>mdi-cube</v-icon> Gross Sales
    </h2>
    <v-divider></v-divider>
    <v-row>
      <v-col md="4">
        <h3 class="text-center pt-4">Totals</h3>
        <h1 class="text-center py-0 pt-3 font-weight-bold display-2">
          <!-- {{ dashboard.productSale.toFixed(2) }} -->
        </h1>
        <h2 class="text-center pb-8 grey--text heading-5">
          <v-icon>mdi-cube-send</v-icon> Products Sale
        </h2>
      </v-col>
      <v-col md="4">
        <h3 class="text-center pt-4">Totals</h3>
        <h1 class="text-center py-0 pt-3 font-weight-bold display-2">
          <!-- {{ dashboard.inStock }} -->
        </h1>
        <h2 class="text-center pb-8 grey--text heading-5">
          <v-icon>mdi-cube-scan</v-icon> Product in stock
        </h2>
      </v-col>
      <v-col md="4">
        <h3 class="text-center pt-4">Totals</h3>
        <h1 class="text-center py-0 pt-3 font-weight-bold display-2">
          <!-- {{ dashboard.customers }} -->
        </h1>
        <h2 class="text-center pb-8 grey--text heading-5">
          <v-icon>mdi-clipboard-account-outline</v-icon> Customers
        </h2>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col md="4" sm="12" class="px-8"
        ><v-btn block tile color="primary" @click="printReport"
          ><v-icon left>mdi-printer</v-icon>Print Report</v-btn
        ></v-col
      >
    </v-row>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["dashboard"]),
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
};
</script>

<style lang="scss" scoped>
</style>
