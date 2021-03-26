<template>
  <v-layout row justify-center>
    <v-flex sm12 md8>
      <GrossSale style="z-index: 1000" />
    </v-flex>
    <vue-particles
      v-if="!$vuetify.breakpoint.mobile"
      color="#1d2228"
      :particleOpacity="0.8"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="3"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.6"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
      style="
        position: fixed;
        top: 0px;
        left: 0%;
        width: 100vw;
        height: 100vh;
        z-index: 1;
      "
    ></vue-particles>
  </v-layout>
</template>


<script>
import { mapFields } from "vuex-map-fields";

export default {
  middleware: ["auth"],
  transition: "slide-bottom",
  components: {
    GrossSale: () => import("~/components/dashboard/GrossSale"),
  },
  computed: {
    ...mapFields(["products", "header"]),
  },
  created() {
    this.header = "Dashboard";
  },
};
</script>
