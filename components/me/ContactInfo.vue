<template>
  <v-card class="mt-5" :loading="application.loading">
    <v-card-title>Contact Info</v-card-title>
    <v-card-subtitle
      >Some information that customers use to contact you
      <a>Learn more</a></v-card-subtitle
    >
    <v-simple-table>
      <template v-slot:default>
        <tbody>
          <tr @click="isChangePhone = true">
            <td width="30%" class="grey--text text--darken-1">Contact</td>
            <td width="70%">
              <template v-if="isChangePhone">
                <v-row>
                  <v-col md="12"
                    ><v-text-field
                      v-model="auth.user.phone"
                      v-mask="`###-###-####`"
                      autofocus
                      @change="
                        save({
                          phone: auth.user.phone,
                        })
                      "
                      @blur="
                        save({
                          phone: auth.user.phone,
                        })
                      "
                      :disabled="application.loading"
                    ></v-text-field
                  ></v-col>
                </v-row>
              </template>
              <span v-else> {{ auth.user.phone }}</span>
            </td>
            <td width="10%">
              <v-icon right>mdi-menu-right</v-icon>
            </td>
          </tr>
          <tr @click="isChangeEmail = true">
            <td width="30%" class="grey--text text--darken-1">Email</td>
            <td width="70%">
              <template v-if="isChangeEmail">
                <v-row>
                  <v-col md="12"
                    ><v-text-field
                      v-model="auth.user.email"
                      type="email"
                      autofocus
                      @change="
                        save({
                          email: auth.user.email,
                        })
                      "
                      @blur="
                        save({
                          email: auth.user.email,
                        })
                      "
                      :disabled="application.loading"
                    ></v-text-field
                  ></v-col>
                </v-row>
              </template>
              <span v-else> {{ auth.user.email }}</span>
            </td>
            <td width="10%">
              <v-icon right>mdi-menu-right</v-icon>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import qs from "qs";

export default {
  data() {
    return {
      isChangePhone: false,
      isChangeEmail: false,
      text: "Your information has been saved!",
      snackbar: false,
      timeout: 2000,
    };
  },
  computed: {
    ...mapFields(["auth", "application"]),
  },
  methods: {
    async save(params) {
      try {
        this.$store.commit("SET_APPLICATION_LOADING", true);
        await this.$axios.put(
          `/account/me?${qs.stringify(params)}&token=${this.auth.access_token}`
        );
        this.$store.commit("SET_APPLICATION_LOADING", false);
        this.snackbar = true;
      } catch (e) {
        this.$swal("Internal Server Error", e.message, "error");
      }
      this.isChangePhone = false;
      this.isChangeEmail = false;
    },
  },
};
</script>


<style scoped>
tr {
  cursor: pointer;
}
</style>
