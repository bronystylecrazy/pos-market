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
      <v-card class="py-10">
        <v-card-title>
          <span class="headline"
            ><v-icon left>mdi-clipboard-edit-outline</v-icon>Login to
            Sirawit-POS</span
          >
        </v-card-title>
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
                  @keyup.enter="handleLogIn"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Password*"
                  v-model="data.password"
                  type="password"
                  @keyup.enter="handleLogIn"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="teal" text @click="handleLogIn">
            <v-icon left>mdi-login-variant</v-icon> Login
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapFields } from "vuex-map-fields";
import { fillSchema, schema } from "~/store/members";
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
  }),
  methods: {
    async handleLogIn() {
      const result = this.members.filter((member) => {
        return (
          member.username === this.data.username &&
          member.password === this.data.password
        );
      });

      if (result.length >= 1) {
        this.auth.user = fillSchema(result[0]);
        this.auth.isLoggedIn = true;

        this.$swal("Login success!", "Yaaaayyyyy", "success").then(() => {
          this.$router.push("/");
        });
        return false;
      }
      this.$swal("Error go away!!", "ASAP", "error").then(() => {
        this.data.username = "";
        this.data.password = "";
      });
      this.data.username = "";
      this.data.password = "";
    },
  },
  computed: {
    ...mapFields(["members", "auth"]),
  },
  created() {
    this.auth.isLoggedIn = false;
    this.auth.user = schema;
    localStorage.clear();
  },
};
</script>

<style lang="scss" scoped>
</style>