<template>
  <v-card :loading="application.loading">
    <v-card-title>Basic Info</v-card-title>
    <v-card-subtitle
      >Some info may be visible to other people in Pos-Market.
      <a>Learn more</a></v-card-subtitle
    >
    <v-simple-table>
      <template v-slot:default>
        <tbody>
          <tr>
            <td class="py-10 grey--text text--darken-1" width="20%">Photo</td>
            <td width="70%" class="grey--text text--darken-1">
              A photo that personalize your account
            </td>
            <td width="10%">
              <v-avatar>
                <img :src="auth.user.image" alt="John" />
              </v-avatar>
            </td>
          </tr>
          <tr @click="isChangeName = true">
            <td width="30%" class="grey--text text--darken-1">Name</td>
            <td width="70%">
              <template v-if="isChangeName">
                <v-row>
                  <v-col md="6"
                    ><v-text-field
                      v-model="auth.user.first_name"
                      @change="
                        save({
                          last_name: auth.user.last_name,
                          first_name: auth.user.first_name,
                        })
                      "
                      @keypress.enter="
                        save({
                          last_name: auth.user.last_name,
                          first_name: auth.user.first_name,
                        })
                      "
                    ></v-text-field
                  ></v-col>
                  <v-col md="6"
                    ><v-text-field
                      v-model="auth.user.last_name"
                      @change="
                        save({
                          last_name: auth.user.last_name,
                          first_name: auth.user.first_name,
                        })
                      "
                      @keypress.enter="
                        save({
                          last_name: auth.user.last_name,
                          first_name: auth.user.first_name,
                        })
                      "
                      autofocus
                      :disabled="application.loading"
                    ></v-text-field
                  ></v-col>
                </v-row>
              </template>
              <span v-else
                >{{ auth.user.first_name }} {{ auth.user.last_name }}</span
              >
            </td>
            <td width="10%">
              <v-icon right>mdi-menu-right</v-icon>
            </td>
          </tr>
          <tr @click="isChangeGender = true">
            <td width="30%" class="grey--text text--darken-1">Gender</td>
            <td width="70%">
              <v-select
                style="width: 150px"
                dense
                :items="['Not mentioned', 'Male', 'Female']"
                v-model="auth.user.gender"
                @change="save({ gender: auth.user.gender })"
                autofocus
                :disabled="application.loading"
              ></v-select>
              <!-- <span v-else>{{ auth.user.gender }}</span> -->
            </td>
            <td width="10%">
              <v-icon right>mdi-menu-right</v-icon>
            </td>
          </tr>
          <tr>
            <td width="30%" class="grey--text text--darken-1">Password</td>
            <td width="70%" class="py-5">
              *********<br /><span class="grey--text text--darken-1"
                >Last changed {{ $moment(auth.user.uat).fromNow() }}</span
              >
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
      isChangeName: false,
      isChangeGender: false,
      text: "Your information has been saved!",
      snackbar: false,
      timeout: 2000,
    };
  },
  computed: {
    ...mapFields(["auth", "header", "application"]),
  },
  methods: {
    async save(params) {
      try {
        await this.$axios.put(`/account/me?${qs.stringify(params)}`);
        this.snackbar = true;
      } catch (e) {
        this.$swal("Internal Server Error", e.message, "error");
      }
      this.isChangeName = false;
      this.isChangeGender = false;
    },
  },
};
</script>

<style scoped>
tr {
  cursor: pointer;
}
</style>
