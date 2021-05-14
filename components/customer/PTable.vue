te<template>
  <v-data-table
    :headers="headers"
    :items="filteredCustomers"
    v-model="selected"
    style="box-shadow: 0 0 1px 0 rgb(0 0 0 / 10%)"
    show-select
    :search="search"
    :loading="application.loading"
    loading-text="Loading... Please wait"
  >
    <template #item.id="{ item }">
      <b>{{ item.id }}</b>
    </template>
    <template #item.name="{ item }">
      <v-chip label v-bind="attrs" v-on="on" pill>
        <v-avatar left>
          <v-img>
            <img :src="item.image" />
          </v-img>
        </v-avatar>
        <b>{{ item.first_name }} {{ item.last_name }}</b></v-chip
      >
    </template>
    <template #item.customerID="{ item }">
      <v-chip label class="mr-2">
        <v-icon left> mdi-barcode </v-icon>
        <b>{{ item.customerID }}</b>
      </v-chip>
    </template>
    <template #item.phone="{ item }">
      <v-chip label class="mr-2">
        <v-icon left> mdi-card-account-phone </v-icon>
        {{ item.phone | VMask("###-###-####") }}
      </v-chip>
    </template>

    <template #item.visit="{ item }">
      <v-chip>
        <v-icon left>mdi-poll-box</v-icon>
        {{ item.visit }}</v-chip
      >
    </template>
    <template #item.store="{ item }">
      <v-chip>
        <v-icon left>mdi-store</v-icon>
        {{ item.store }}</v-chip
      >
    </template>
    <template #item.reward="{ item }">
      <v-chip>
        <v-icon left>mdi-medal</v-icon>
        {{ item.reward }}</v-chip
      >
    </template>
    <template #item.iat="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-chip label v-bind="attrs" v-on="on">
            <v-icon left>mdi-clock-alert</v-icon>
            {{ $moment(new Date(item.iat)).fromNow() }}</v-chip
          >
        </template>
        <span>{{ new Date(item.iat) }}</span>
      </v-tooltip>
    </template>
    <template #item.uat="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-chip label v-bind="attrs" v-on="on">
            <v-icon left>mdi-clock-check</v-icon
            >{{ $moment(new Date(item.uat)).fromNow() }}</v-chip
          >
        </template>
        <span>{{ new Date(item.uat) }}</span>
      </v-tooltip>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title
          ><v-icon left>mdi-account-supervisor-circle-outline</v-icon>Manage
          Customer</v-toolbar-title
        >
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
                <v-text-field
                  v-model="editedItem.first_name"
                  label="First Name"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.last_name"
                  label="Last Name"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.phone"
                  label="Phone Number"
                  prepend-inner-icon="mdi-card-account-phone"
                  v-mask="'###-###-####'"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.reward"
                  prepend-inner-icon="mdi-medal"
                  label="Reward"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.visit"
                  prepend-inner-icon="mdi-poll-box"
                  label="Visit"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.store"
                  label="Store"
                  prepend-inner-icon="mdi-store"
                ></v-text-field>
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
      <v-btn fab x-small color="teal" dark>
        <v-icon @click="editItem(item)"> mdi-pencil </v-icon>
      </v-btn>
      <v-btn fab x-small color="red" dark>
        <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
      </v-btn>
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
        align: "left",
        sortable: true,
        width: "4%",
      },
      {
        text: "#Customer ID",
        value: "customerID",
        align: "left",
        sortable: true,
        width: "10%",
      },
      // {
      //   text: "Picture",
      //   value: "image",
      //   align: "center",
      //   sortable: false,
      //   width: "4%",
      // },
      {
        text: "Firstname-Lastname",
        align: "start",
        sortable: true,
        value: "name",
        width: "20%",
      },
      { text: "Phone", value: "phone", sortable: true },
      { text: "visit", value: "visit", sortable: true },
      { text: "reward", value: "reward", sortable: true },
      { text: "store", value: "store", sortable: true },
      { text: "Created at", value: "iat", align: "left", sortable: true },
      { text: "Updated at", value: "uat", align: "left", sortable: true },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      first_name: "",
      last_name: "",
      phone: "",
      image: "",
      reward: 0,
      store: 0,
      visit: 0,
    },
    defaultItem: {
      first_name: "",
      last_name: "",
      phone: "",
      image: "",
      reward: 0,
      store: 0,
      visit: 0,
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Customer" : "Edit Customer";
    },
    ...mapFields([
      "products",
      "header",
      "checkout",
      "customers",
      "application",
    ]),
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
    deleteSelected() {},
    editItem(item) {},
    deleteItem(item) {
      this.$swal
        .fire({
          icon: "question",
          title: "Do you want to delete this customer?",
          text: "You cannot undo the changes!",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: `Yes, please.`,
          cancelButtonText: `No, that was a mistake.`,
        })
        .then(async (result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            const data = await this.$store.dispatch("deleteCustomer", item.id);
            if (!data.error)
              this.$swal.fire(data.title, data.message, "success");
          } else if (result.isDenied) {
            this.$swal.fire(
              "Changes are not saved!",
              "Selected customer wasn't deleted!",
              "error"
            );
          }
        });
    },

    deleteItemConfirm() {},

    close() {},

    closeDelete() {},
    save() {},
  },
};
</script>
