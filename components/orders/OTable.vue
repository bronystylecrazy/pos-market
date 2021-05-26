<template>
  <v-container>
    <v-layout row justify-center wrap>
      <v-flex md10 sm12 xs12>
        <v-card :loading="application.loading">
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              style="max-width: 300px"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="transactions_history"
            :items-per-page="20"
            class="elevation-1 clicktable"
            :search="search"
            @click:row="view"
          >
            <template #item.customer="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    label
                    pill
                    style="width: 100%"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-avatar
                      v-if="!!item.customer.image"
                      left
                      size="16"
                      style="transform: scale(0.8)"
                      ><v-img
                        color="gray"
                        :src="item.customer.image || ``"
                      ></v-img
                    ></v-avatar>
                    <b>{{ item.customer.customerID || "Unknown" }}</b>
                  </v-chip>
                </template>
                {{ item.customer.first_name }}
                {{ item.customer.last_name }}
              </v-tooltip>
            </template>
            <template #item.iat="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    label
                    pill
                    style="width: 100%"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon left>mdi-clock-check</v-icon>
                    <b>{{ $moment(item.iat).fromNow() }}</b>
                  </v-chip>
                </template>
                {{ item.iat }}
              </v-tooltip>
            </template>
            <template #item.total_price="{ item }">
              ${{ item.total_price }}
            </template>
            <template #item.total_netprice="{ item }">
              ${{ item.total_netprice }}
            </template>
            <template #item.total_items="{ item }">
              {{ item.total_items }} plcs</template
            >
            <template #item.next="{ item }"
              ><v-icon>mdi-chevron-right</v-icon></template
            >
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapFields } from "~/node_modules/vuex-map-fields";
export default {
  data() {
    return {
      search: "",
      headers: [
        { align: "center", text: "id", value: "id" },
        {
          width: "20%",
          align: "left",
          text: "transactionID",
          value: "transactionID",
        },
        {
          align: "center",
          text: "total item(s)",
          value: "total_items",
        },
        {
          align: "center",
          text: "net price",
          value: "total_netprice",
        },
        {
          align: "center",
          text: "total price",
          value: "total_price",
        },
        ,
        {
          align: "right",
          text: "by",
          value: "customer",
        },
        { align: "right ", text: "issued at", value: "iat" },
        { sortable: false, align: "right ", text: "", value: "next" },
      ],
      history: [],
    };
  },
  computed: {
    ...mapFields([
      "products",
      "header",
      "carts",
      "checkout.categories",
      "application",
      "auth",
      "customers",
      "orders",
    ]),
    transactions() {
      const obj = {};
      this.history
        .sort((a, b) => {
          return this.$moment(b.iat).unix() - this.$moment(a.iat).unix();
        })
        .forEach((h, idx) => {
          if (h.paymentID in obj) {
            obj[h.paymentID].push({
              ...h,
              id: obj[h.paymentID].length + 1,
            });
          } else {
            obj[h.paymentID] = [{ ...h, id: 1 }];
          }
        });
      return obj;
    },
    transactions_history() {
      return Object.keys(this.transactions).map((t, id) => ({
        id,
        transactionID: t,
        total_items: this.transactions[t].reduce((c, a) => c + a.amount, 0),
        total_price: (
          1.07 *
          this.transactions[t].reduce((c, a) => c + a.amount * a.price, 0)
        ).toFixed(2),
        total_netprice: this.transactions[t]
          .reduce((c, a) => c + a.amount * a.price, 0)
          .toFixed(2),
        iat: this.transactions[t][0]?.iat,
        customer:
          this.customers.find(
            (c) => c.customerID === this.transactions[t][0]?.customerID
          ) || {},
      }));
    },
  },
  methods: {
    view(item) {
      this.$router.push(
        `/customer/${item.customer.id}?trans_id=${item.transactionID}`
      );
    },
  },
  async mounted() {
    this.header = "Orders";
    this.application.appbar = true;
    this.application.loading = true;
    await Promise.all([
      this.$store.dispatch("fetchHistory"),
      this.$store.dispatch("fetchProduct"),
      this.$store.dispatch("fetchCustomer"),
    ]);
    this.application.loading = false;
    this.history = this.orders;
  },
};
</script>

<style>
.clicktable tr {
  cursor: pointer;
}
</style>
