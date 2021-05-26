<template>
  <v-layout row class="px-3 pt-2" justify-center>
    <v-card class="mt-3" style="width: 100%">
      <v-card-title class="subtitle"
        >Customer<v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn small v-bind="attrs" v-on="on" dark @click="cast"
              ><v-icon>mdi-cast</v-icon></v-btn
            >
          </template>
          <span>Split the screen realtime</span>
        </v-tooltip>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-autocomplete
          v-model="select"
          :loading="loading"
          :items="items"
          item-text="search"
          item-value="customerID"
          :search-input.sync="search"
          flat
          hide-no-data
          hide-details
          label="Search for customer..."
          solo-inverted
          autocomplete="off"
          prepend-inner-icon="mdi-barcode"
          v-if="customer == undefined || customer == null"
        >
          <template v-slot:item="data">
            <v-list-item-avatar>
              <img :src="data.item.image" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                v-html="data.item.first_name + ' ' + data.item.last_name"
              ></v-list-item-title>
              <v-list-item-subtitle
                v-html="data.item.customerID"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </v-autocomplete>
        <v-list-item v-else>
          <v-list-item-avatar>
            <img :src="customer.image" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              v-html="customer.first_name + ' ' + customer.last_name"
            ></v-list-item-title>
            <v-list-item-subtitle
              v-html="customer.customerID"
            ></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn fab dark x-small @click="select = null"
              ><v-icon>mdi-clipboard-edit</v-icon></v-btn
            >
          </v-list-item-action>
        </v-list-item>
      </v-card-text>
    </v-card>
    <v-simple-table
      dark
      class="mt-2"
      style="width: 100%; border-radius: 5px 5px 0px 0px"
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center" width="5%">Plc(s)</th>
            <th class="text-left" width="75%">Name</th>
            <th class="text-center" width="20%">price</th>
            <th class="text-center" width="20%">actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in currentPage" :key="item.name">
            <td class="text-center">{{ item.buy }}x</td>
            <td class="text-left">
              <v-avatar size="32"><v-img :src="item.image"></v-img></v-avatar
              ><b class="ml-5">{{ item.title }}</b>
            </td>
            <td class="text-left">${{ item.price }}</td>
            <td class="text-center">
              <v-btn
                dark
                fab
                x-small
                color="red"
                style="height: 16px; width: 16px"
                @click="removeFromCart(item)"
                ><v-icon style="font-size: 10px">mdi-minus</v-icon></v-btn
              >
            </td>
          </tr>
          <tr v-for="n in blankItem" :key="n">
            <td colspan="4"></td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-card dark style="width: 100%; border-radius: 0px 0px 5px 5px">
      <v-card-text>
        <v-pagination
          :disabled="checkout.carts.length <= 0"
          v-model="page"
          class="mt-2"
          :length="length"
        ></v-pagination>
      </v-card-text>
    </v-card>

    <v-card style="width: 100%" class="mt-4">
      <v-card-text>
        <v-layout>
          <v-btn
            block
            depressed
            large
            :dark="!!select"
            :disabled="!select"
            :color="!select ? `#767676` : `#b5cc18`"
            @click="processPayment"
            v-if="serializeCheckout.length > 0"
            ><v-icon left>mdi-cash-check</v-icon> Process payment</v-btn
          >
          <v-btn
            block
            depressed
            large
            light
            disabled
            @click="processPayment"
            v-else
            ><v-icon left>mdi-cash-check</v-icon> Process payment</v-btn
          >
          <!-- <v-btn color="#b5cc18" flat dark
            ><v-icon>mdi-cast-connected</v-icon></v-btn
          > -->
        </v-layout>
      </v-card-text>
    </v-card>
  </v-layout>
</template>
<script>
import { mapFields } from "vuex-map-fields";
import { mapGetters } from "vuex";
import qs from "qs";
import { nanoid } from "nanoid";

export default {
  components: {
    PCard: () => import("~/components/product/PCard"),
  },
  data() {
    return {
      loading: false,
      items: [],
      search: null,
      select: null,
      page: 1,
      castUrl: "",
      transactionID: "",
    };
  },
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  computed: {
    ...mapFields([
      "products",
      "header",
      "categories",
      "checkout",
      "application",
      "auth",
      "customers",
      "realtime.stompClient",
    ]),
    ...mapGetters(["serializeCheckout"]),
    states() {
      return this.customers.map((c) => ({
        search: c.customerID + " " + c.first_name + " " + c.last_name,
        ...c,
      }));
    },
    customer() {
      return this.customers.find((c) => c.customerID === this.select || 0);
    },
    currentPage() {
      return this.reverse(this.serializeCheckout).filter(
        (x, index) =>
          index >= (this.page - 1) * 6 && index < (this.page - 1) * 6 + 6
      );
    },

    blankItem() {
      return 6 - this.currentPage.length;
    },
    length() {
      return Number.parseInt(Math.ceil(this.serializeCheckout.length / 6));
    },
  },
  methods: {
    cast() {
      let payload = this.toBinary(
        JSON.stringify([
          ...this.serializeCheckout.map(({ id, stock, buy }) => ({
            id,
            stock,
            buy,
          })),
        ])
      );
      window.open(
        `/monitor?${qs.stringify({
          trans_id: this.$route.query.trans_id || "Unknown",
          payload,
        })}`,
        "_blank"
      );
    },
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      setTimeout(() => {
        this.items = this.states.filter((e) => {
          return (
            (e.search || "").toLowerCase().indexOf((v || "").toLowerCase()) > -1
          );
        });
        this.loading = false;
      }, 500);
    },
    reverse(customers) {
      if (this.$store.state.application.setting.console_log)
        console.log("custoners", customers);
      var clone = customers.map((c) => c);
      clone.reverse();
      return clone;
    },
    removeFromCart(item) {
      if (this.$store.state.application.setting.console_log)
        console.log(item.id);
      var deletedItems = [
        ...this.checkout.carts.filter((p) => p.id !== item.id),
      ];
      var before = this.checkout.carts.length;
      this.checkout.carts = deletedItems;
      var after = this.checkout.carts.length;
      this.products.find((p) => p.id === item.id).stock += before - after;

      let payload = this.toBinary(
        JSON.stringify([
          ...this.serializeCheckout.map(({ id, stock, buy }) => ({
            id,
            stock,
            buy,
          })),
        ])
      );

      this.stompClient.send(
        "/app/checkout",
        JSON.stringify({
          from: this.auth.user.memid,
          payload,
          transactionID: this.$route.query.trans_id || "Unknown",
        })
      );
    },
    toBinary(str) {
      return btoa(
        encodeURIComponent(str).replace(
          /%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode("0x" + p1);
          }
        )
      );
    },
    async processPayment() {
      const items = [...this.serializeCheckout];
      let isComplete = 0;
      let tasks = [];
      for (var item of items) {
        const { id, buy } = item;
        const params = {
          transactionID: this.$route.query.trans_id || nanoid(),
          customerID: this.customer.customerID,
          amount: buy,
        };

        const promise = this.$axios.post(
          `/transaction/${id}?${qs.stringify(params)}`
        );

        tasks.push(promise);
      }

      await Promise.all(tasks);

      const transactionID = nanoid();
      const from = this.$route.query.trans_id || "Unknown";

      this.$swal({
        title: "Sold out products completely!",
        text: `total ${items.reduce((c, r) => c + r.buy, 0)} items`,
        icon: "success",
        timer: 2000,
      }).then(() => this.$router.push(`/checkout?trans_id=${transactionID}`));

      this.$axios.post(`/event/transaction-complete/`);
      this.stompClient.send(
        "/app/transaction-next",
        JSON.stringify({
          transactionID,
          from,
        })
      );

      this.checkout.carts = [];
    },
  },
  created() {
    this.querySelections("");
    this.items = [...this.states];
    this.transactionID = this.$route.query.trans_id;
    this.castUrl = `/monitor?${qs.stringify({
      trans_id: this.transactionID,
    })}`;
  },
};
</script>

