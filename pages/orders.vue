<template>
  <OTable />
</template>

<script>
export default {
  components: {
    OTable: () => import("~/components/orders/OTable"),
  },
};
</script>
