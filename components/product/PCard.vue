<template>
  <v-card
    class="custome_card mx-auto"
    elevation="0.5"
    :loading="application.loading"
    @click="$emit('onClick')"
    @dblclick="$emit('onDoubleClick')"
    :id="`product-${item.id}`"
  >
    <v-card-title class="ma-0">
      {{ item.title }} <v-spacer></v-spacer>
      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            fab
            x-small
            v-bind="attrs"
            v-on="on"
            style="margin-right: -10px"
            :disabled="application.loading"
            ><v-icon>mdi-dots-vertical</v-icon></v-btn
          >
        </template>

        <v-list :disabled="application.loading">
          <v-list-item @click="edit(item, isWithImage)">
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
          <v-list-item @click="deleteItem(item)">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-subtitle
      ><v-icon>mdi-cash</v-icon> $ {{ item.price }} •
      {{ item.category }}</v-card-subtitle
    >
    <v-list-item three-line :disabled="application.loading">
      <v-list-item-avatar class="rounded" tile size="80" color="grey"
        ><v-img :src="item.image"
      /></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
        <div class="overline mb-4">
          <v-chip label small v-if="item.stock <= 0" dark color="#db2828"
            ><v-icon small left>mdi-hexagon-multiple-outline</v-icon
            ><b>Sold out</b></v-chip
          >
          <v-chip label small v-else-if="item.stock <= 10" dark color="#fbbd08"
            ><v-icon small left>mdi-hexagon-multiple</v-icon
            ><b> {{ item.stock }} plcs</b></v-chip
          >
          <v-chip label small v-else-if="item.stock <= 100" dark color="#00b5ad"
            ><v-icon small left>mdi-hexagon-multiple</v-icon
            ><b> {{ item.stock }} plcs</b></v-chip
          >
          <v-chip label small v-else class="custom-chip" color="#2185d0" dark
            ><v-icon small left>mdi-hexagon-multiple</v-icon
            ><b> {{ item.stock }} plcs</b></v-chip
          >
        </div>
      </v-list-item-content>
    </v-list-item>
    <!-- <v-card-actions>
      <v-btn x-small fab color="primary" elevation="2"
        ><v-icon>mdi-cog</v-icon></v-btn
      >
      <v-spacer></v-spacer>
      <v-btn x-small fab color="primary" elevation="2" @click="product"
        ><v-icon>mdi-minus</v-icon></v-btn
      >
      <v-btn x-small fab color="primary" elevation="2"
        ><v-icon>mdi-plus</v-icon></v-btn
      >
    </v-card-actions> -->
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
              <v-row justify="center">
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
                  v-if="isWithImage"
                  chips
                  counter
                  show-size
                  truncate-length="15"
                  label="Upload the product image"
                  accept="image/png, image/jpeg, image/bmp"
                  v-model="editedItem.file"
                ></v-file-input>
                <v-col v-else justify-center md="8">
                  <v-card>
                    <v-list-item three-line :disabled="application.loading">
                      <v-list-item-avatar
                        class="rounded"
                        tile
                        size="80"
                        color="grey"
                        ><v-img :src="item.image"
                      /></v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-subtitle
                          >Preview image but you can change
                          it!</v-list-item-subtitle
                        >
                        <div class="overline mb-4">
                          <v-btn
                            @click="isWithImage = true"
                            color="primary"
                            small
                            ><v-icon left>mdi-image-edit</v-icon>Change
                            picture</v-btn
                          >
                        </div>
                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="updateItem(item, isWithImage)"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { mapFields } from "vuex-map-fields";
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      dialog: false,
      isEdit: true,
      isWithImage: false,
      editedItem: {
        title: "",
        price: 0.0,
        description: "",
        category: [],
        stock: 0,
        file: null,
      },
    };
  },
  methods: {
    deleteItem(item) {
      this.$swal
        .fire({
          icon: "question",
          title: "Do you want to delete this product?",
          text: "You cannot undo the changes!",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: `Yes, please.`,
          cancelButtonText: `No, that was a mistake.`,
        })
        .then(async (result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            const data = await this.$store.dispatch("deleteProduct", item.id);
            if (!data.error)
              this.$swal.fire({
                title: data.title,
                text: data.message,
                icon: "success",
                timer: 2000,
              });
          } else if (result.isDenied) {
            this.$swal.fire(
              "Changes are not saved!",
              "Selected customer wasn't deleted!",
              "error"
            );
          }
        });
    },
    async edit(item) {
      this.dialog = true;
      this.editedItem.title = item.title;
      this.editedItem.price = item.price;
      this.editedItem.description = item.description;
      this.editedItem.category = item.category.split(",");
      this.editedItem.stock = item.stock;
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
            image: preview,
            category: this.editedItem.category.join(","),
            title: this.editedItem.title,
            price: this.editedItem.price,
            description: this.editedItem.description,
            stock: this.editedItem.stock,
          };
          console.log("request params", params);
          this.$store
            .dispatch("updateProduct", { params, id: item.id })
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
            category: this.editedItem.category.join(","),
            title: this.editedItem.title,
            price: this.editedItem.price,
            description: this.editedItem.description,
            stock: this.editedItem.stock,
          };

          console.log("request params", params);
          this.$store
            .dispatch("updateProduct", { params, id: item.id })
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
  },
  computed: {
    ...mapFields([
      "products",
      "header",
      "categories",
      "checkout",
      "application",
      "auth",
    ]),
  },
};
</script>

<style scoped>
.custome_card .v-card__subtitle {
  padding-bottom: 0px;
}

.custom-chip .v-chip__content {
  text-transform: unset;
}
</style>
