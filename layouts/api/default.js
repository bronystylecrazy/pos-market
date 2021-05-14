import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

import {
  mapFields
} from "vuex-map-fields";


export default {
  data() {
    return {
      messages: {},
    };
  },
  methods: {
    fromBinary(str) {
      // Going backwards: from bytestream, to percent-encoding, to original string.
      return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    },
    connect() {
      this.socket = new SockJS("http://localhost:8080/gs-guide-websocket");
      this.stompClient = Stomp.over(this.socket);

      this.stompClient.connect({},
        (frame) => {
          console.log(frame);
          this.application.websocket = true;
          this.messages.customerMessage = this.stompClient.subscribe(
            "/topic/customer",
            async (tick) => {
              console.log(tick);
              const messageObject = JSON.parse(tick.body);
              this.application.loading = true;
              await this.$store.dispatch("fetchCustomer", this.$store.dispatch("fetchOverview"));
              this.application.loading = false;
              this.$toast("Customer updated!", {
                timeout: 3500,
                icon: true,
              });
            }
          );

          this.messages.memberMessage = this.stompClient.subscribe(
            "/topic/member",
            async (tick) => {
              console.log(tick);
              const messageObject = JSON.parse(tick.body);
              this.application.loading = true;
              await Promise.all([this.$store.dispatch("fetchMember"), this.$store.dispatch("fetchOverview")]);
              this.application.loading = false;
              this.$toast("Member updated!", {
                timeout: 3500,
                icon: true,
              });
            }
          );

          this.messages.productMessage = this.stompClient.subscribe(
            "/topic/product",
            async (tick) => {
              console.log(tick);
              const messageObject = JSON.parse(tick.body);
              this.application.loading = true;
              await Promise.all([this.$store.dispatch("fetchProduct"), this.$store.dispatch("fetchOverview")]);
              this.application.loading = false;
              this.$toast("Product updated!", {
                timeout: 3500,
                icon: true,
              });
            }
          );

          this.messages.memberMessage = this.stompClient.subscribe(
            "/topic/profile",
            async (tick) => {
              console.log(tick);
              const messageObject = JSON.parse(tick.body);
              if (messageObject.content.trim() !== this.auth.user.memid) return;
              this.application.loading = true;
              await Promise.all([this.$store.dispatch("fetchProfile")]);
              this.application.loading = false;
              this.$toast("Profile updated!", {
                timeout: 3500,
                icon: true,
              });
            }
          );

          this.stompClient.subscribe("/topic/monitor", (tick) => {
            const decodedPayload = this.fromBinary(JSON.parse(tick.body).payload);
            const carts = JSON.parse(decodedPayload);
            console.log(carts)
            this.checkout.monitorCarts = carts;
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
  computed: {
    ...mapFields(["application", "auth", "checkout", "realtime.socket", "realtime.stompClient"]),
  },
  created() {
    this.$vuetify.theme.dark = false;
    this.connect();
  },
}
