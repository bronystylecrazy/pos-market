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
  async created() {
    this.$vuetify.theme.dark = true;
    await this.$store.dispatch("fetchRole");
  },
};
</script>

<style lang="scss" scoped>
</style>
