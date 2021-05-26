<template>
  <v-dialog v-model="application.api" scrollable max-width="680px">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-simple-table>
          <thead>
            <th>method</th>
            <th>resource</th>
            <th>description</th>
          </thead>
          <thead>
            <template v-if="apis.length > 0">
              <tr v-for="api in apis" :key="JSON.stringify(api)">
                <td>{{ api.method }}</td>
                <td>{{ api.resource }}</td>
                <td>{{ api.description }}</td>
              </tr>
            </template>
            <tr>
              <td colspan="3">no api found!</td>
            </tr>
          </thead>
        </v-simple-table>
      </v-card-text>
    </v-card></v-dialog
  >
</template>

<script>
import { mapFields } from "~/node_modules/vuex-map-fields";
export default {
  props: {
    title: {
      type: String,
      default: "✨ Looking for API",
    },
    apis: {
      type: Array,
      default: [],
    },
  },
  components: {},
  data() {
    return {
      dialog: false,
    };
  },
  watch: {
    show(n, p) {
      this.dialog = n;
    },
  },
  computed: {
    ...mapFields(["application"]),
  },
};
</script>
