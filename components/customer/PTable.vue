te<template>
  <v-data-table
    :headers="headers"
    :items="filteredCustomers"
    v-model="selected"
    style="box-shadow: 0 0 1px 0 rgb(0 0 0 / 10%)"
    show-select
    :search="search"
  >
    <template #item.id="{ item }">
      <b>{{ item.id }}</b>
    </template>
    <template #item.name="{ item }">
      <b>{{ item.firstName }} {{ item.lastName }}</b>
    </template>
    <template #item.customerID="{ item }">
      <b>{{ item.customerID }}</b>
    </template>
    <template #item.phone="{ item }">
      {{ item.phone | VMask("###-###-####") }}
    </template>
    <template #item.iat="{ item }">
      {{ new Date(item.iat) }}
    </template>
    <template #item.uat="{ item }">
      {{ new Date(item.uat) }}
    </template>
    <template #item.image="{ item }" style="width: 20%">
      <v-avatar color="primary" size="32">
        <img :src="`https://i.pravatar.cc/190?u=${item.image}`" alt="John"
      /></v-avatar>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Manage Customer</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2 ml-4"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon left>mdi-notebook-edit-outline</v-icon> New Customer
            </v-btn>
            <v-btn
              dark
              class="mb-2 ml-4"
              v-bind="attrs"
              @click="deleteSelected"
              :disabled="!selected[0]"
            >
              DELETE SELECTED
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.customerID"
                      label="Customer ID"
                      v-mask="'###########'"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" sm="12" md="6">
                    <v-text-field
                      v-model="editedItem.firstName"
                      label="First Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" sm="12" md="6">
                    <v-text-field
                      v-model="editedItem.lastName"
                      label="Last Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.phone"
                      label="Phone Number"
                      v-mask="'###-###-####'"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="12" md="12">
                    <v-list class="mb-2 elevation-2" rounded>
                      <v-list-item>
                        <v-list-item-avatar color="primary">
                          <v-img
                            :src="`https://i.pravatar.cc/190?u=${editedItem.image}`"
                          ></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-text-field
                            v-model="editedItem.image"
                            placeholder="fake avatar.."
                            label="Image"
                          ></v-text-field>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn icon>
                            <v-icon
                              color="grey lighten-1"
                              @click="
                                checkout.customerProfile.show = !checkout
                                  .customerProfile.show
                              "
                              >mdi-information</v-icon
                            >
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template> -->
  </v-data-table>
</template>

<script>
import { mapFields } from "vuex-map-fields";
export default {
  props: {
    tab: Number,
  },
  data: () => ({
    selected: [],
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "#ID",
        value: "id",
        align: "center",
        sortable: true,
        width: "4%",
      },
      {
        text: "#Customer ID",
        value: "customerID",
        align: "center",
        sortable: true,
        width: "10%",
      },
      {
        text: "Picture",
        value: "image",
        align: "center",
        sortable: false,
        width: "4%",
      },
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "name",
        width: "20%",
      },
      { text: "Phone", value: "phone", sortable: true },
      { text: "Created at", value: "iat", sortable: true },
      { text: "Updated at", value: "uat", sortable: true },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      customerID: "",
      firstName: "",
      lastName: "",
      phone: "",
      image: "",
    },
    defaultItem: {
      customerID: "",
      firstName: "",
      lastName: "",
      phone: "",
      image: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Customer" : "Edit Customer";
    },
    ...mapFields(["products", "header", "checkout", "customers"]),
    filteredCustomers() {
      return this.customers;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {},

  methods: {
    initialize() {},
    deleteSelected() {
      for (var s of this.selected) {
        this.customers.splice(this.customers.indexOf(s), 1);
      }
      this.$store.dispatch("up");
    },
    editItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.$store.dispatch("up");
    },

    deleteItem(item) {
      this.editedIndex = this.customers.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
      this.$store.dispatch("up");
    },

    deleteItemConfirm() {
      this.customers.splice(this.editedIndex, 1);
      this.closeDelete();
      this.$store.dispatch("up");
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.$store.dispatch("up");
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.$store.dispatch("up");
    },
    save() {
      const date = Date.now();
      if (this.editedIndex > -1) {
        const newData = {
          ...this.editedItem,
          uat: date,
        };
        if (typeof data.iat === "undefined") data.iat = date;
        Object.assign(this.customers[this.editedIndex], newData);
      } else {
        const data = {
          ...this.editedItem,
          id:
            Number.parseInt(this.customers[this.customers.length - 1].id || 0) +
            1,
          uat: date,
          iat: date,
          service: {
            reward: 0,
            visit: 0,
            store: 0,
          },
        };

        this.customers.push(data);
      }
      this.close();
      this.$store.dispatch("up");
    },
  },
};
</script>