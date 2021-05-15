<template>
  <v-card class="mt-5" :loading="application.loading">
    <v-card-title>Settings</v-card-title>
    <v-card-subtitle
      >Setting your account for better experience :)
      <a>Learn more</a></v-card-subtitle
    >
    <v-simple-table>
      <template v-slot:default>
        <tbody>
          <tr>
            <td class="py-5 grey--text text--darken-1" width="20%">
              Real-time Notify
            </td>
            <td width="70%">
              Raises the notification when information changed
            </td>
            <td width="10%">
              <v-switch
                v-model="setting.realtime_notify"
                :disabled="application.loading"
                @change="$toast.success('Setting has been updated!')"
              ></v-switch>
            </td>
          </tr>
          <tr>
            <td width="30%" class="grey--text text--darken-1">Console Log</td>
            <td width="70%">Keeps us dealing with error or stuff</td>
            <td width="10%">
              <v-switch
                v-model="setting.console_log"
                :disabled="application.loading"
                @change="$toast.success('Setting has been updated!')"
              ></v-switch>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapFields(["auth", "header", "application.setting", "application"]),
  },
  created() {
    this.header = "Account Setting";
  },
};
</script>
