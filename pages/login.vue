<template>
  <v-row justify="center">
    <vue-particles
      v-if="!$vuetify.breakpoint.mobile"
      color="#fff"
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
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card :loading="loading">
        <template slot="progress">
          <v-progress-linear
            color="teal"
            height="5"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-card-title class="pt-10">
          <span class="headline"
            ><v-icon left>mdi-clipboard-edit-outline</v-icon>Login to
            Sirawit-POS</span
          >
        </v-card-title>
        <v-divider></v-divider>
        <v-card-subtitle class="mt-5"
          >** backend api <b>pos-market-api by Sirawit Pratoomsuwan</b>
        </v-card-subtitle>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Username*"
                  v-model="data.username"
                  required
                  autofocus
                  autocomplete="off"
                  @keyup.enter="handleLogIn(3500)"
                  :disabled="loading"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  label="Password*"
                  v-model="data.password"
                  type="password"
                  @keyup.enter="handleLogIn(3500)"
                  :disabled="loading"
                  required
                ></v-text-field>
              </v-col>
              <v-alert
                prominent
                type="error"
                v-if="!!$route.query.error_message && showError"
                width="100%"
              >
                <v-row align="center">
                  <v-col class="grow">
                    {{ error_message }}
                  </v-col>
                  <v-col class="shrink">
                    <v-btn @click="showError = false">Close</v-btn>
                  </v-col>
                </v-row>
              </v-alert>
            </v-row>
          </v-container>

          <small>Don't have an account? </small>
          <small
            ><a
              color="dark"
              @click="$router.push('/register')"
              :loading="loading"
            >
              Create new account!
            </a></small
          >
        </v-card-text>
        <v-card-actions class="px-10 pb-10">
          <v-spacer></v-spacer>
          <v-btn
            color="teal"
            @click="handleLogIn(3500)"
            large
            :loading="loading"
            block
          >
            <v-icon left>mdi-login-variant</v-icon> Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapFields } from "vuex-map-fields";
import { fillSchema, schema } from "~/store/models/members";

export default {
  layout: "authentication",
  middleware: ["guest"],
  data: () => ({
    data: {
      username: "",
      password: "",
    },
    dialog: true,
    error: false,
    loading: false,
    error_message: "",
    showError: true,
  }),
  methods: {
    async handleLogIn(timer = 1500) {
      this.loading = true;
      try {
        const params = { ...this.data };
        const data = await this.$store.dispatch("login", params);
        if (!data.error) {
          this.auth.user = data.response;
          this.auth.access_token = data.meta.access_token;
          this.auth.isLoggedIn = true;
          console.log(data);
          console.log(this.auth);
        }

        this.$swal({
          title: data.title,
          text: data.message,
          icon: data.error ? "error" : "success",
          timer,
        }).then(() => this.$router.push("/"));
      } catch (err) {
        this.$swal
          .fire({
            title: err.message,
            text: "Couldn't connect to the server!",
            icon: "error",
            timer: 3500,
          })
          .then(() => this.$router.push("/login"));
      }
      this.loading = false;
    },
  },
  computed: {
    ...mapFields(["members", "auth"]),
  },
  mounted() {
    this.auth.isLoggedIn = false;
    this.auth.user = schema;
    localStorage.clear();
    this.error_message = this.$route.query.error_message;

    if (!!this.$route.query.pwd) {
      try {
        const data = JSON.parse(atob(this.$route.query.pwd));
        console.log(data);
        this.data.username = data.username;
        this.data.password = data.password;
        this.handleLogIn(500);
      } catch (err) {
        this.$swal
          .fire({
            title: "Login failed!",
            text: "invalid quick-login token!",
            icon: "error",
            timer: 1500,
          })
          .then(() => this.$router.push("/login"));
      }
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
