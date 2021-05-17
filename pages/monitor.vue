<template>
  <v-layout row justify-center class="mt-10">
    <v-flex md8><VTable style="z-index: 25000" :items="syncCarts" /></v-flex>
  </v-layout>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import qs from "qs";
import { mapFields } from "vuex-map-fields";

export default {
  layout: "empty",
  components: {
    VTable: () => import("~/components/monitor/VTable"),
  },
  computed: {
    ...mapFields([
      "header",
      "products",
      "checkout",
      "realtime.stompClient",
      "application",
    ]),
    syncCarts() {
      return this.checkout.monitorCarts
        .map((item) => {
          const fetchProduct = this.products.find((p) => p.id === item.id);
          return {
            ...fetchProduct,
            buy: item.buy,
            newStock: item.stock,
          };
        })
        .filter((p) => !!p.id);
    },
  },
  async mounted() {
    this.header = "Monitor";
    if (typeof this.$route.query.payload !== "undefined") {
      const decodedPayload = this.fromBinary(this.$route.query.payload);
      try {
        const carts = JSON.parse(decodedPayload);
        console.log(carts);
        this.checkout.monitorCarts = carts;
      } catch (e) {
        this.$swal({
          title: "Fatal Error!",
          text: "Couldn't get data from checkout page!",
          timer: 2500,
          icon: "error",
        });
      }
    }

    this.application.appbar = true;
    this.application.loading = true;
    await this.$store.dispatch("fetch");
    this.application.loading = false;
    this.connect();
  },
  methods: {
    fromBinary(str) {
      // Going backwards: from bytestream, to percent-encoding, to original string.
      return decodeURIComponent(
        window
          .atob(str)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
    },
    connect() {
      this.socket = new SockJS("http://localhost:8080/gs-guide-websocket");
      this.stompClient = Stomp.over(this.socket);

      this.stompClient.connect(
        {},
        (frame) => {
          console.log(frame);
          this.application.websocket = true;

          this.stompClient.subscribe("/topic/monitor", (tick) => {
            const transactionID = JSON.parse(tick.body).transactionID;
            if (transactionID !== (this.$route.query.trans_id || "Unknown"))
              return;

            const decodedPayload = this.fromBinary(
              JSON.parse(tick.body).payload
            );
            const carts = JSON.parse(decodedPayload);
            console.log(carts);
            this.$router.push(
              `/monitor?${qs.stringify({
                trans_id: this.$route.query.trans_id,
                payload: JSON.parse(tick.body).payload,
              })}`
            );
            this.checkout.monitorCarts = carts;
          });

          this.stompClient.subscribe("/topic/transaction-next", (tick) => {
            const { transactionID, from } = JSON.parse(tick.body);
            console.log(tick.body);
            if (from !== (this.$route.query.trans_id || "Unknown")) return;
            this.$swal({
              title: "Purchase succeed!",
              text: "Enjoy your meal :D",
              icon: "success",
              timer: 2500,
            }).then(() => {
              this.$router.push(`/monitor?trans_id=${transactionID}`);
            });
            this.checkout.monitorCarts = [];
          });
        },
        (error) => {
          console.log(error);
          setTimeout(() => this.connect(), 1000);
          for (var m of this.messages) this.messages[m].unsubscribe();
          this.application.websocket = false;
        }
      );
    },
  },
};
</script>
