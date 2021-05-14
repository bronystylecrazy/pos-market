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
        <template v-if="step == 1">
          <v-card-title>
            <span class="headline"
              ><v-icon left>mdi-clipboard-edit-outline</v-icon>Register to
              Sirawit-POS</span
            >
          </v-card-title>
          <v-card-subtitle class="red--text mt-2"
            >** Add new user to the system</v-card-subtitle
          >
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
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Password*"
                    v-model="data.password"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Confirm Password*"
                    v-model="data.confirmPassword"
                    type="password"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-btn color="teal" text @click="$router.push('/login')">
              <v-icon left>mdi-login-variant</v-icon> Already had an account
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="teal" @click="step = 2">
              <v-icon left>mdi-login-variant</v-icon> Next Step
            </v-btn>
          </v-card-actions>
        </template>
        <template v-if="step == 2">
          <v-card-title>
            <span class="headline"
              ><v-icon left>mdi-clipboard-edit-outline</v-icon>Almost done,
              Complete your profile first!</span
            >
          </v-card-title>
          <v-card-subtitle class="red--text mt-2"
            >** Add new user profile to the system</v-card-subtitle
          >
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="First Name*"
                    v-model="data.first_name"
                    required
                    autofocus
                    autocomplete="off"
                    @keyup.enter="handleRegister"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Last Name*"
                    v-model="data.last_name"
                    required
                    autocomplete="off"
                    @keyup.enter="handleRegister"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Email*"
                    v-model="data.email"
                    required
                    autocomplete="off"
                    @keyup.enter="handleRegister"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Phone*"
                    v-model="data.phone"
                    required
                    autocomplete="off"
                    @keyup.enter="handleRegister"
                    v-mask="'###-###-####'"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    label="Role*"
                    :items="filteredRoles"
                    v-model="data.roles"
                    required
                    autocomplete="off"
                    @keyup.enter="handleRegister"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn color="teal" text @click="step = 1">
              <v-icon left>mdi-login-variant</v-icon> Previous step
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="teal" @click="handleRegister">
              <v-icon left>mdi-login-variant</v-icon>Complete your registation!
            </v-btn>
          </v-card-actions>
        </template>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { mapFields } from "vuex-map-fields";
import { fillSchema, schema } from "~/store/models/members";
import VueRecaptcha from "vue-recaptcha";

export default {
  layout: "authentication",
  middleware: ["guest"],
  components: {
    VueRecaptcha,
  },
  data: () => ({
    data: {
      username: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      roles: "Member",
    },
    dialog: true,
    error: false,
    step: 1,
  }),
  methods: {
    async handleRegister() {
      try {
        const params = { ...this.data };
        const data = await this.$store.dispatch("register", params);
        this.$swal.fire({
          title: data.title,
          text: data.message,
          icon: data.error ? "error" : "success",
          timer: 1500,
        });

        if (!data.error) {
          this.$router.push(
            `/login?pwd=${btoa(
              JSON.stringify({
                username: this.data.username,
                password: this.data.password,
              })
            )}`
          );
        }
      } catch (e) {
        this.$swal("Internal Server Error", data.message, "error");
      }
    },
  },
  computed: {
    ...mapFields(["members", "auth", "roles"]),
    filteredRoles() {
      return this.roles.map((r) => r.name.trim());
    },
  },
  created() {
    this.auth.isLoggedIn = false;
    this.auth.user = schema;
    localStorage.clear();
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
