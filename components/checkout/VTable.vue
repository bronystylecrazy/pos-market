<template>
  <div class="center">
    <vs-table style="color: white; width: 100%">
      <template #thead>
        <vs-tr>
          <vs-th> Product name </vs-th>
          <vs-th> Price </vs-th>
          <vs-th> Id </vs-th>
        </vs-tr>
      </template>
      <template #tbody>
        <vs-tr
          :key="i"
          v-for="(tr, i) in items"
          :data="tr"
          :danger="tr.id == 3"
          :success="tr.id == 5"
          :primary="tr.id == 8"
          :warn="tr.id == 9"
        >
          <vs-td>
            {{ tr.title }}
          </vs-td>
          <vs-td>
            {{ tr.price }}
          </vs-td>
          <vs-td>
            {{ tr.id }}
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>


<script>
export default {
  data: () => ({}),
  props: {
    items: Array,
  },
};
</script>

        