<template>
  <v-app>
    <VNavbar style="z-index: 6000" />
    <VAppbar style="z-index: 5000" v-if="application.appbar" />
    <v-main>
      <v-container fluid class="px-4">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Setup from "./api/default";
export default {
  components: {
    VNavbar: () => import("~/components/VNavbar"),
    VAppbar: () => import("~/components/VAppbar"),
  },
  ...Setup,
};
</script>

<style>
.theme--light.v-application {
  background: #f4f6f9;
}
</style>

