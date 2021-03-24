<template>
  <div class="index">Hello</div>
</template>


<script>
import { mapFields } from "vuex-map-fields";

export default {
  transition: "slide-bottom",
  components: {},
  computed: {
    ...mapFields(["products", "header"]),
  },
  created() {
    this.header = "Dashboard";
  },
};
</script>
