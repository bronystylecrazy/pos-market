<template>
  <v-app>
    <VNavbar style="z-index: 6000" />
    <VAppbar style="z-index: 5000" />
    <v-main>
      <v-container fluid class="px-4">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

import { mapFields } from "vuex-map-fields";

export default {
  components: {
    VNavbar: () => import("~/components/VNavbar"),
    VAppbar: () => import("~/components/VAppbar"),
  },
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

      this.stompClient.connect(
        {},
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
};
</script>

<style>
.theme--light.v-application {
  background: #f4f6f9;
}
</style>
