<template>
  <v-simple-table style="width: 100%" dense class="cshadow">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-center" width="5%">Plc(s)</th>
          <th class="text-left" width="75%">Name</th>
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
          <td class="text-center">${{ (item.price * item.buy).toFixed(2) }}</td>
        </tr>
        <tr></tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    items: Array,
  },
};
</script>
