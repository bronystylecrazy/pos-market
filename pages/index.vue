<template>
  <div class="container">
    <vs-button flat :active="active" @click="login()"> Active </vs-button>
    <vs-button v-for="item in items" :key="item.id">{{ item.title }}</vs-button>
    <vs-button flat @click="showNoti"> Show noti</vs-button>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
import VuesaxLogo from "~/components/VuesaxLogo.vue";

export default {
  components: {
    Logo,
    VuesaxLogo,
  },
  data: () => ({
    items: [],
    active: true,
  }),
  methods: {
    login() {
      this.$axios
        .get("https://jsonplaceholder.typicode.com/todos")
        .then((response) => {
          this.items = response.data;
        });
    },
    showNoti() {
      const noti = this.$vs.notification({
        color: "teal",
        title: "Documentation Vuesax 4.0+",
        text:
          "These documents refer to the latest version of vuesax (4.0+), to see the documents of the previous versions you can do it here 👉 Vuesax 3.x",
      });
    },
  },
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 55px;
  color: #35495e;
  letter-spacing: 1px;
  text-transform: capitalize;
  margin: 25px 0;
}

.subtitle {
  font-weight: 300;
  font-size: 1.1rem;
  color: #526488;
  word-spacing: 2px;
  padding-bottom: 15px;
  max-width: 600px;
}

.subtitle a {
  font-weight: 500;
  color: inherit;
}

.links {
  padding-top: 15px;
  margin-bottom: 20px;
}

.content-logos {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 500px;
}

.plus {
  font-size: 2.5rem;
  margin: 15px;
  color: #35495e;
}

.h3 {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-weight: 400;
  margin: 10px;
}
</style>
