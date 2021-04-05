<template>
  <v-data-table
    :headers="headers"
    :items="filteredProducts"
    v-model="selected"
    sort-by="calories"
    style="box-shadow: 0 0 1px 0 rgb(0 0 0 / 10%)"
    show-select
    :search="search"
  >
    <template #item.id="{ item }">
      <b>{{ item.id }}</b>
    </template>
    <template #item.price="{ item }">
      <b>{{ item.price }}$</b>
    </template>
    <template #item.category="{ item }">
      <v-chip
        class="ma-2"
        :color="checkout.categoryColours[item.category] || $randomColor()"
        label
        text-color="white"
        :key="item.category + item.title"
      >
        <v-icon left> mdi-label </v-icon>
        {{ _.capitalize(item.category) }}
      </v-chip>
    </template>
    <template #item.image="{ item }" style="width: 20%">
      <v-avatar color="primary" size="32">
        <img
          :src="`https://avatars.dicebear.com/api/jdenticon/${editedItem.image}.svg`"
          alt="John"
      /></v-avatar>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title
          >Manage {{ checkout.categories[tab - 1] || "All" }}</v-toolbar-title
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
              <v-icon left>mdi-notebook-edit-outline</v-icon>
              New Product
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
                      v-model="editedItem.title"
                      label="Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model.number="editedItem.price"
                      label="Price"
                      type="number"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      v-model="editedItem.category"
                      label="Category"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-list class="mb-2 elevation-2" rounded>
                      <v-list-item>
                        <v-list-item-avatar color="primary">
                          <v-img
                            :src="`https://avatars.dicebear.com/api/jdenticon/${editedItem.image}.svg`"
                          ></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-text-field
                            v-model="editedItem.image"
                            placeholder="https://avatars.dicebear.com/api/jdenticon/productname.svg"
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
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      v-model="editedItem.description"
                      label="Description"
                    ></v-textarea>
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
        text: "Picture",
        value: "image",
        align: "center",
        sortable: false,
      },
      {
        text: "Name",
        align: "start",
        sortable: true,
        value: "title",
        width: "20%",
      },
      {
        text: "Description",
        value: "description",
        sortable: true,
        width: "30%",
      },
      { text: "Category", value: "category", sortable: true },
      { text: "Price", value: "price", sortable: true, width: "10%" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      title: "",
      price: 0.0,
      description: "",
      category: "",
      image: "",
    },
    defaultItem: {
      title: "",
      price: 0.0,
      description: "",
      category: "",
      image: "",
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Item" : "Edit Item";
    },
    ...mapFields(["products", "header", "checkout"]),
    filteredProducts() {
      return this.tab !== 0
        ? this.products.filter(
            (product) =>
              product.category === this.checkout.categories[this.tab - 1]
          )
        : this.products;
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
        this.products.splice(this.products.indexOf(s), 1);
      }
      this.$store.dispatch("up");
    },
    editItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.$store.dispatch("up");
    },

    deleteItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
      this.$store.dispatch("up");
    },

    deleteItemConfirm() {
      this.products.splice(this.editedIndex, 1);
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
      if (this.editedIndex > -1) {
        Object.assign(this.products[this.editedIndex], this.editedItem);
      } else {
        const data = {
          ...this.editedItem,
          id:
            Number.parseInt(this.products[this.products.length - 1].id || 0) +
            1,
        };
        this.products.push(data);

        if (!this.checkout.categories.includes(data.category))
          this.checkout.categories.push(data.category);
      }
      this.close();
      this.$store.dispatch("up");
    },
  },
};
</script>