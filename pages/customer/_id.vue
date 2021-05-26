<template>
  <v-container>
    <v-layout row justify-center wrap>
      <v-flex md8 sm12 xs12>
        <!-- <v-card :loading="application.loading">{{ profile }}</v-card> -->
        <v-card :loading="application.loading">
          <v-card-title>Basic Info</v-card-title>
          <v-card-subtitle
            >Some info may be visible to other people in Pos-Market.
            <a>Learn more</a></v-card-subtitle
          >
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td class="py-10 grey--text text--darken-1" width="20%">
                    Photo
                  </td>
                  <td width="70%" class="grey--text text--darken-1">
                    A photo of customer
                  </td>
                  <td width="10%">
                    <v-avatar>
                      <img :src="profile.image" alt="John" />
                    </v-avatar>
                  </td>
                </tr>
                <tr>
                  <td width="30%" class="grey--text text--darken-1">Name</td>
                  <td width="70%">
                    <span
                      >{{ profile.first_name }} {{ profile.last_name }}</span
                    >
                  </td>
                  <td width="10%">
                    <v-icon right>mdi-menu-right</v-icon>
                  </td>
                </tr>
                <tr>
                  <td width="30%" class="grey--text text--darken-1">
                    customer ID
                  </td>
                  <td width="70%">
                    <v-chip label class="mr-2">
                      <v-icon left> mdi-barcode </v-icon>
                      <b>{{ profile.customerID }}</b>
                    </v-chip>
                  </td>
                  <td width="10%">
                    <v-icon right>mdi-menu-right</v-icon>
                  </td>
                </tr>
                <tr>
                  <td width="30%" class="grey--text text--darken-1">Phone</td>
                  <td width="70%">
                    <span>{{ profile.phone }}</span>
                  </td>
                  <td width="10%">
                    <v-icon right>mdi-menu-right</v-icon>
                  </td>
                </tr>
                <tr>
                  <td width="30%" class="grey--text text--darken-1">
                    Activity
                  </td>
                  <td width="70%">
                    <v-chip pill label small>
                      <v-icon left>mdi-poll-box</v-icon
                      ><b>{{ profile.visit }}</b></v-chip
                    >
                    <v-chip pill label small
                      ><v-icon left>mdi-store</v-icon
                      ><b>{{ profile.store }}</b></v-chip
                    >
                    <v-chip pill label small
                      ><v-icon left>mdi-medal</v-icon
                      ><b>{{ profile.reward }}</b></v-chip
                    >
                  </td>
                  <td width="10%">
                    <v-icon right>mdi-menu-right</v-icon>
                  </td>
                </tr>
                <tr>
                  <td width="30%" class="grey--text text--darken-1">
                    Update at
                  </td>
                  <td width="70%">
                    <span
                      >{{ profile.uat }} ({{
                        $moment(profile.uat).fromNow()
                      }})</span
                    >
                  </td>
                  <td width="10%">
                    <v-icon right>mdi-menu-right</v-icon>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
        <v-fade-transition mode="out-in">
          <v-card
            :loading="application.loading"
            class="mt-4 clicktable"
            v-if="transactionID === ''"
          >
            <v-card-title>Transactions</v-card-title>
            <v-card-subtitle
              >Payment informations for {{ profile.first_name }}
              {{ profile.last_name }} <a>Learn more</a></v-card-subtitle
            >
            <v-data-table
              :items="transactions_history"
              :headers="headers"
              @click:row="view"
            >
              <template #item.next="{ item }">
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </v-data-table>
          </v-card>
          <template v-else>
            <v-card
              :key="`card` + transactionID"
              class="mt-4"
              :loading="application.loading"
            >
              <v-card-title>
                <v-chip label pill small
                  ><v-icon left>mdi-barcode</v-icon
                  ><b>TransactionID {{ transactionID }}</b></v-chip
                >
                <v-spacer></v-spacer>
                <v-btn fab icon small @click="close"
                  ><v-icon>mdi-close-circle</v-icon></v-btn
                >
              </v-card-title>
              <v-simple-table dense v-if="!!transactions[transactionID]">
                <thead>
                  <th width="5%" class="text-center">id</th>
                  <th width="35%" class="text-left">Title</th>
                  <th width="15%" class="text-center">Price</th>
                  <th width="10%" class="text-center">Amount</th>
                  <th width="20%" class="text-center">Total</th>
                </thead>
                <tbody>
                  <tr
                    v-for="h in transactions[transactionID]"
                    :key="JSON.stringify(h)"
                  >
                    <td class="text-center">{{ h.id }}</td>
                    <td class="text-left">
                      <!-- <v-chip pill label style="width: 100%"> -->
                      {{ getProduct(h.pid).title }}
                      <!-- </v-chip> -->
                    </td>
                    <td class="text-center">
                      <!-- <v-chip pill label style="width: 100%"> -->
                      ${{ h.price }}
                      <!-- </v-chip> -->
                    </td>
                    <td class="text-center">
                      <!-- <v-chip pill label style="width: 100%"> -->
                      x{{ h.amount }}
                      <!-- </v-chip> -->
                    </td>
                    <td class="text-center">
                      <!-- <v-chip pill label style="width: 100%"> -->
                      ${{ h.amount * h.price }}
                      <span class="subtitle"
                        >(${{ h.price }}x{{ h.amount }})</span
                      >
                      <!-- </v-chip> -->
                    </td>
                    <!-- <td class="text-center"> -->
                    <!-- <v-chip pill label style="width: 100%" class="text-center"> -->
                    <!-- {{
                $moment(h.iat).fromNow()
              }}<br /> -->

                    <!-- </v-chip> -->
                    <!-- </td> -->
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td colspan="2" class="text-right py-5">
                      <b
                        >NET TOTAL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${{
                          transactions[transactionID]
                            .reduce((c, r) => c + r.price * r.amount, 0)
                            .toFixed(2)
                        }}</b
                      ><br />
                      <b
                        >VAT 7% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${{
                          (
                            0.07 *
                            transactions[transactionID].reduce(
                              (c, r) => c + r.price * r.amount,
                              0
                            )
                          ).toFixed(2)
                        }}</b
                      ><br />
                      <b
                        >TOTAL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${{
                          (
                            1.07 *
                            transactions[transactionID].reduce(
                              (c, r) => c + r.price * r.amount,
                              0
                            )
                          ).toFixed(2)
                        }}</b
                      >
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card>
          </template>
        </v-fade-transition>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapFields } from "~/node_modules/vuex-map-fields";
export default {
  middleware: ["auth", "admin", "superadmin"],
  data() {
    return {
      transactionID: "",
      profile: {},
      history: [],
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
        { align: "right ", text: "issued at", value: "iat" },
        { sortable: false, align: "right ", text: "", value: "next" },
      ],
    };
  },
  methods: {
    getProduct(pid) {
      return (
        this.products.find((p) => p.id === pid) || {
          id: 0,
          title: "No product preview",
          description: "Product has been deleted",
          category: "Deleted",
          image: "http://localhost:8080/preview/5",
        }
      );
    },
    view(item) {
      this.transactionID = item.transactionID;
      this.$router.push(
        `/customer/${this.profile.id}?trans_id=${item.transactionID}`
      );
      this.transactionID = item.transactionID;
    },
    close() {
      this.$router.push(`/customer/${this.profile.id}`);
      this.transactionID = "";
    },
  },
  computed: {
    ...mapFields(["auth", "header", "products", "application"]),
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
      }));
    },
  },
  mounted() {
    this.header = "View Customer";
    this.$store.dispatch("fetchProduct");
    this.$store.commit("SET_APPLICATION_LOADING", true);
    this.$axios.get(`/customer/${this.$route.params.id}`).then(({ data }) => {
      this.profile = data.response;
      this.$store.commit("SET_APPLICATION_LOADING", false);
      this.$store.commit("SET_APPLICATION_LOADING", true);
      this.$axios
        .get(`/customer/${data.response.customerID}/history`)
        .then(({ data }) => {
          this.history = data.response;
          this.$store.commit("SET_APPLICATION_LOADING", false);
        });
    });
  },
  created() {
    this.transactionID = this.$route.query.trans_id || "";
    console.log(this.transactionID);
  },
};
</script>

<style>
.clicktable tr {
  cursor: pointer;
}
</style>
