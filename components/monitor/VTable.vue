<template>
  <v-layout row>
    <v-flex md8>
      <h1>Realtime Monitoring</h1>
      <v-chip label small dark>
        <v-icon left>mdi-barcode</v-icon>
        <b>Transaction number: {{ $route.query.trans_id || "Unknown" }} </b>
      </v-chip>
    </v-flex>
    <v-flex md4 class="text-right">
      <h2 class="mt-5">{{ items.reduce((c, r) => c + r.buy, 0) }} item(s)</h2>
    </v-flex>
    <v-simple-table
      style="width: 100%; z-index: 5000"
      dense
      class="cshadow mt-4"
      :loading="true"
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center" width="5%">Plc(s)</th>
            <th class="text-left" width="60%">Name</th>
            <th class="text-center" width="20%">price</th>
            <th class="text-center" width="20%">total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.title">
            <td class="text-center">{{ item.buy }}x</td>
            <td class="text-left">
              <v-avatar size="24"><v-img :src="item.image"></v-img></v-avatar
              ><b class="ml-5">{{ item.title }}</b>
            </td>
            <td class="text-center">${{ item.price }}</td>
            <td class="text-center">
              ${{ (item.price * item.buy).toFixed(2) }}
            </td>
          </tr>
          <tr class="text-center" v-if="items.length <= 0">
            <td colspan="4">
              <v-alert
                class="mt-4"
                width="100%"
                type="success"
                text
                icon="mdi-information"
                >There's nothing to show, waiting for the system...
              </v-alert>
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td colspan="2" class="text-right py-5">
              <b
                >NET TOTAL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${{
                  items.reduce((c, r) => c + r.price * r.buy, 0).toFixed(2)
                }}</b
              ><br />
              <b
                >VAT 7% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${{
                  (
                    0.07 * items.reduce((c, r) => c + r.price * r.buy, 0)
                  ).toFixed(2)
                }}</b
              ><br />
              <b
                >TOTAL &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${{
                  (
                    1.07 * items.reduce((c, r) => c + r.price * r.buy, 0)
                  ).toFixed(2)
                }}</b
              >
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-layout>
</template>

<script>
export default {
  props: {
    items: Array,
  },
};
</script>
