<template>
  <v-app>
    <v-main>
      <v-container fluid class="px-4">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  created() {
    this.$vuetify.theme.dark = true;
  },
};
</script>

<style lang="scss" scoped>
</style>