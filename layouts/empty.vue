<template>
  <v-app>
    <v-main>
      <v-container fluid class="px-4">
        <Nuxt />
        <vue-particles
          v-if="!$vuetify.breakpoint.mobile"
          color="#1d2228"
          :particleOpacity="0.3"
          :particlesNumber="80"
          shapeType="circle"
          :particleSize="3"
          linesColor="#dedede"
          :linesWidth="1"
          :lineLinked="true"
          :lineOpacity="0.4"
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
      </v-container>
    </v-main>
  </v-app>
</template>
