<template>
  <v-layout row justify-center wrap>
    <v-flex md6>
      <v-card>{{ profile }}</v-card>
      <v-card class="mt-4">{{ history }}</v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapFields } from "~/node_modules/vuex-map-fields";
export default {
  data() {
    return {
      profile: {},
      history: [],
    };
  },
  computed: {
    ...mapFields(["auth", "header"]),
  },
  mounted() {
    this.header = "View Customer";
    this.$axios
      .get(`/customer/${this.$route.params.id}?token=${this.auth.access_token}`)
      .then(({ data }) => {
        this.profile = data.response;
        this.$axios
          .get(
            `/customer/${data.response.customerID}/history?token=${this.auth.access_token}`
          )
          .then(({ data }) => {
            this.history = data.response;
          });
      });
  },
};
</script>
