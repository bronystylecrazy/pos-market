<template>
  <v-app>
    <VNavbar />
    <VAppbar />
    <v-main>
      <v-container fluid class="px-4">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  components: {
    VNavbar: () => import("~/components/VNavbar"),
    VAppbar: () => import("~/components/VAppbar"),
  },
  data() {
    return {};
  },
  created() {
    this.$vuetify.theme.dark = false;
  },
};
</script>

<style>
.theme--light.v-application {
  background: #f4f6f9;
}
</style>