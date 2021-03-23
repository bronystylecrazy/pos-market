<template>
  <div class="index">Hello</div>
</template>


<script>
import { mapFields } from "vuex-map-fields";

export default {
  components: {},
  computed: {
    ...mapFields(["products", "header"]),
  },
  created() {
    this.header = "Dashboard";
  },
};
</script>
