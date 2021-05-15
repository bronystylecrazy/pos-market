<template>
  <v-layout row>
    <!-- <v-flex v-if="application.loading">
      <v-skeleton-loader
        xs12
        sm6
        md3
        class="pa-2"
        type="card"
        v-for="n in 20"
        :key="n"
      ></v-skeleton-loader>
    </v-flex> -->
    <v-flex sm12 md12 class="px-2">
      <v-alert icon="mdi-cube" prominent text type="info">
        <v-row align="center">
          <v-col class="grow">
            <b
              >Oh, no... Hey, {{ auth.user.first_name }}
              {{ auth.user.last_name }}</b
            ><br />
            If you want more product, please insert it to your system :).
          </v-col>
          <v-col class="shrink">
            <v-btn @click="dialog = true"
              ><v-icon left>mdi-cube-send</v-icon>Insert product</v-btn
            >
          </v-col>
        </v-row>
      </v-alert>
    </v-flex>

    <v-flex
      xs12
      sm6
      md3
      v-for="product in products"
      :key="product.productid"
      class="pa-2"
    >
      <PCard :item="product" />
    </v-flex>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
      style="z-index: 10000"
    >
      <v-card>
        <v-form ref="form" lazy-validation>
          <v-card-title>
            <span v-if="isEdit" class="headline">
              <v-icon left>mdi-cube-send</v-icon>Edit product
            </span>
            <span v-else class="headline">
              <v-icon left>mdi-cube-send</v-icon>Insert product
            </span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    label="Name/title"
                    hint="Name of your product"
                    v-model="editedItem.title"
                    prepend-inner-icon="mdi-rename-box"
                    required
                  ></v-text-field>

                  <v-textarea
                    label="Description"
                    hint="briefly explain your product"
                    v-model="editedItem.description"
                    prepend-inner-icon="mdi-tag-text"
                    required
                  ></v-textarea>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-autocomplete
                    :items="categories.map((e) => e.name)"
                    label="Category*"
                    hint="Categories of your product"
                    multiple
                    required
                    v-model="editedItem.category"
                    prepend-inner-icon="mdi-tag"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    type="number"
                    label="Price*"
                    v-model="editedItem.price"
                    prepend-inner-icon="mdi-cash"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                    v-model="editedItem.stock"
                    type="number"
                    label="Stock*"
                    prepend-inner-icon="mdi-cube"
                    required
                  ></v-text-field>
                </v-col>
                <v-file-input
                  chips
                  counter
                  show-size
                  truncate-length="15"
                  label="Upload the product image"
                  accept="image/png, image/jpeg, image/bmp"
                  v-model="editedItem.file"
                ></v-file-input>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="insertItem"> Save </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<script>
import { mapFields } from "vuex-map-fields";

export default {
  components: {
    PCard: () => import("~/components/product/PCard"),
  },
  props: {
    tab: Number,
  },
  data: () => ({
    selected: [],
    search: "",
    dialog: false,
    isEdit: false,
    editedItem: {
      title: "",
      price: 0.0,
      description: "",
      category: [],
      stock: 0,
      file: null,
    },
    defaultItem: {
      title: "",
      price: 0.0,
      description: "",
      category: [],
      stock: 0,
      file: null,
    },
  }),
  computed: {
    formTitle() {},
    ...mapFields([
      "products",
      "header",
      "categories",
      "checkout",
      "application",
      "auth",
    ]),
  },
  methods: {
    async insertItem() {
      try {
        const file = this.editedItem.file;
        const myData = new FormData();
        myData.append("file", file);
        console.log(myData);

        const { data } = await this.$axios({
          method: "post",
          url: "/upload",
          headers: { "Content-Type": "multipart/form-data" },
          data: myData,
        });
        console.warn("picture uploaded", data);

        const preview = data.preview;

        const params = {
          image: preview,
          category: this.editedItem.category.join(","),
          title: this.editedItem.title,
          price: this.editedItem.price,
          description: this.editedItem.description,
          stock: this.editedItem.stock,
        };

        console.log("request params", params);

        this.$store.dispatch("insertProduct", params).then((data) => {
          this.$swal.fire({
            title: data.title,
            text: data.message,
            icon: data.error ? "error" : "success",
            timer: 1500,
          });
          this.dialog = false;
          this.editedItem = this.defaultItem;
        });
      } catch (e) {
        this.$swal("Internal Server Error", e.message, "error");
        this.dialog = false;
        this.editedItem = this.defaultItem;
      }
    },
  },
};
</script>
