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
      <v-chip label pill>
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
        <v-dialog v-model="dialog" max-width="680px">
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
          <v-card :loading="application.loading">
            <v-form>
              <v-card-title>
                <span class="headline"
                  ><v-icon left>mdi-account-box-multiple</v-icon
                  >{{ formTitle }}</span
                >
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-container>
                  <v-text-field
                    v-model="editedItem.first_name"
                    label="First Name"
                    :disabled="application.loading"
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.last_name"
                    label="Last Name"
                    :disabled="application.loading"
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.phone"
                    label="Phone Number"
                    prepend-inner-icon="mdi-card-account-phone"
                    v-mask="'###-###-####'"
                    :disabled="application.loading"
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.reward"
                    prepend-inner-icon="mdi-medal"
                    label="Reward"
                    :disabled="application.loading"
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.visit"
                    prepend-inner-icon="mdi-poll-box"
                    label="Visit"
                    :disabled="application.loading"
                  ></v-text-field>
                  <v-text-field
                    v-model="editedItem.store"
                    label="Store"
                    prepend-inner-icon="mdi-store"
                    :disabled="application.loading"
                  ></v-text-field>
                  <v-row justify="center">
                    <v-col md="10" sm="12">
                      <v-list class="mb-2 elevation-2 text-center" rounded>
                        <v-list-item>
                          <v-list-item-avatar size="64" color="primary">
                            <v-img
                              v-if="!isEdit"
                              :src="uploadFile !== null ? uploadFile.url : ''"
                            ></v-img>
                            <v-img v-else :src="editedItem.image"></v-img>
                          </v-list-item-avatar>
                          <v-list-item-content v-if="isEdit">
                            <v-list-item-subtitle
                              >Preview image but you can change
                              it!</v-list-item-subtitle
                            >
                            <div class="overline mb-4" v-if="!isWithImage">
                              <v-btn
                                @click="isWithImage = true"
                                color="primary"
                                small
                                class="mt-4"
                                ><v-icon left>mdi-image-edit</v-icon>Change
                                picture</v-btn
                              >
                            </div>
                            <v-file-input
                              chips
                              counter
                              show-size
                              truncate-length="15"
                              label="Upload the product image"
                              accept="image/png, image/jpeg, image/bmp"
                              v-model="uploadFile"
                              :disabled="application.loading"
                              v-else
                            ></v-file-input>
                          </v-list-item-content>
                          <v-list-item-content v-else>
                            <v-file-input
                              chips
                              counter
                              show-size
                              truncate-length="15"
                              label="Upload the product image"
                              accept="image/png, image/jpeg, image/bmp"
                              v-model="uploadFile"
                              :disabled="application.loading"
                            ></v-file-input>
                          </v-list-item-content>
                          <v-list-item-action> </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close()">
                  Cancel
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="
                    !isEdit ? insertItem() : updateItem(editItem, isWithImage)
                  "
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn fab x-small color="teal" dark @click="editItem(item)">
        <v-icon> mdi-pencil </v-icon>
      </v-btn>
      <v-btn fab x-small color="red" dark @click="deleteItem(item)">
        <v-icon> mdi-delete </v-icon>
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
    isEdit: false,
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
    uploadFile: null,
    isWithImage: false,
  }),
  computed: {
    formTitle() {
      return this.isEdit ? "Edit Customer" : "New Customer";
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

  watch: {},

  created() {},

  methods: {
    close() {
      this.isEdit = this.dialog = this.isWithImage = false;
      this.editedItem = this.defaultItem;
    },
    deleteSelected() {},
    editItem(item) {
      this.isEdit = this.dialog = true;
      this.editedItem.first_name = item.first_name;
      this.editedItem.last_name = item.last_name;
      this.editedItem.phone = item.phone;
      this.editedItem.image = item.image;
      this.editedItem.reward = item.reward;
      this.editedItem.store = item.store;
      this.editedItem.visit = item.visit;
      console.log("editItem", item);
    },
    async updateItem(item, image = true) {
      try {
        if (image) {
          const file = this.editedItem.file;
          if (file == null) {
            this.dialog = this.isWithImage = false;
            throw new Error("Please upload the file!");
          }
          const myData = new FormData();
          myData.append("file", file);
          const { data } = await this.$axios({
            method: "post",
            url: "/upload",
            headers: { "Content-Type": "multipart/form-data" },
            data: myData,
          });
          console.warn("picture uploaded", data);

          const preview = data.preview;

          const params = {
            store: this.editedItem.store,
            image: this.editedItem.image,
            first_name: this.editedItem.first_name,
            last_name: this.editedItem.last_name,
            phone: this.editedItem.phone,
            visit: this.editedItem.visit,
            reward: this.editedItem.reward,
          };

          console.log("request params", params);
          this.$store
            .dispatch("updateCustomer", { params, id: item.id })
            .then((data) => {
              this.$swal.fire({
                title: data.title,
                text: data.message,
                icon: data.error ? "error" : "success",
                timer: 1500,
              });
              this.dialog = this.isWithImage = false;
            });
        } else {
          const params = {
            store: this.editedItem.store,
            image: this.editedItem.image,
            first_name: this.editedItem.first_name,
            last_name: this.editedItem.last_name,
            phone: this.editedItem.phone,
            visit: this.editedItem.visit,
            reward: this.editedItem.reward,
          };

          console.log("request params", params);
          this.$store
            .dispatch("updateCustomer", { params, id: item.id })
            .then((data) => {
              this.$swal.fire({
                title: data.title,
                text: data.message,
                icon: data.error ? "error" : "success",
                timer: 1500,
              });
              this.dialog = this.isWithImage = false;
            });
        }
      } catch (e) {
        this.$swal("Internal Server Error", e.message, "error");
        this.dialog = this.isWithImage = false;
      }
    },
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
    async deleteSelected() {
      const selected = [...this.selected];
      console.log("deletingMultiple", selected);
      this.selected = [];
      this.$swal
        .fire({
          icon: "question",
          title: `Do you want to delete these ${selected.length} customers?`,
          text: "You cannot undo the changes!",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: `Yes, please.`,
          cancelButtonText: `No, that was a mistake.`,
        })
        .then(async (result) => {
          /* Read more about isConfirmed, isDenied below */

          if (result.isConfirmed) {
            selected.forEach(async ({ id }) => {
              const data = await this.$store.dispatch("deleteCustomer", id);
              if (data.error) {
                this.$swal.toast.error(data.message, { icon: true });
              }
            });
          } else if (result.isDenied) {
            this.$swal.fire(
              "Changes are not saved!",
              "Selected accounts weren't deleted!",
              "error"
            );
          }
        });
    },
    async insertItem() {
      this.isEdit = false;
      try {
        const file = this.uploadFile;
        let myData = new FormData();
        myData.append("file", file);
        this.application.loading = true;
        const { data } = await this.$axios({
          method: "post",
          url: "/upload",
          headers: { "Content-Type": "multipart/form-data" },
          data: myData,
        });

        console.warn("picture uploaded", data);

        const preview = data.preview;

        this.editedItem.image = preview;

        const params = {
          store: this.editedItem.store,
          image: this.editedItem.image,
          first_name: this.editedItem.first_name,
          last_name: this.editedItem.last_name,
          phone: this.editedItem.phone,
          visit: this.editedItem.visit,
          reward: this.editedItem.reward,
        };

        console.log("request params", params);

        this.$store.dispatch("insertCustomer", params).then((data) => {
          this.$swal.fire({
            title: data.title,
            text: data.message,
            icon: data.error ? "error" : "success",
            timer: 1500,
          });
          this.dialog = false;
          this.editedItem = this.defaultItem;
          this.uploadFile = null;
        });
      } catch (e) {
        this.$swal("Internal Server Error", e.message, "error");
        this.dialog = false;
        this.editedItem = this.defaultItem;
        this.uploadFile = null;
      }
    },
  },
};
</script>
