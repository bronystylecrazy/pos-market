import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

import {
  mapFields
} from "vuex-map-fields";


export default {
  data() {
    return {
      socket: null,
      stompClient: null,
      messages: {},
    };
  },
  methods: {
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
              await this.$store.dispatch("fetchCustomer");
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
              await Promise.all([this.$store.dispatch("fetchMember")]);
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
              await Promise.all([this.$store.dispatch("fetchProduct")]);
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
    ...mapFields(["application", "auth"]),
  },
  created() {
    this.$vuetify.theme.dark = false;
    this.connect();
  },
}
