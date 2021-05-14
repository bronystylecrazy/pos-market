<template>
  <v-layout row justify-center>
    <v-flex sm12 md6 class="mb-10">
      <BasicInfo />
      <ContactInfo />
      <Setting />
    </v-flex>
  </v-layout>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  components: {
    BasicInfo: () => import("~/components/me/BasicInfo"),
    ContactInfo: () => import("~/components/me/ContactInfo"),
    Setting: () => import("~/components/me/Setting.vue"),
  },
  computed: {
    ...mapFields(["application"]),
  },
  async created() {
    this.application.appbar = true;
    this.$store.commit("SET_APPLICATION_LOADING", true);
    await this.$store.dispatch("fetchProfile");
    this.$store.commit("SET_APPLICATION_LOADING", false);
  },
};
</script>
