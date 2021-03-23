<template>
  <div class="checkout">
    {{ fieldA }}
    <VTable />
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  components: {
    VTable: () => import("~/components/VTable"),
  },
  computed: {
    ...mapFields(["fieldA", "fieldB"]),
  },
};
</script>
