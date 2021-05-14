<template>
  <v-data-table
    :headers="headers"
    :items="filteredMembers"
    v-model="selected"
    item-key="uid"
    style="box-shadow: 0 0 1px 0 rgb(0 0 0 / 10%)"
    show-select
    :search="search"
    :loading="application.loading"
  >
    <template #item.id="{ item }">
      <b>{{ item.uid }}</b>
    </template>
    <template #item.status="{ item }">
      <v-chip label color="teal" dark v-if="item.status == 1"
        ><v-icon left>mdi-access-point</v-icon> <b>Online</b></v-chip
      >
      <v-chip label color="warning" v-else-if="item.status == -1"
        ><v-icon left>mdi-access-point-remove</v-icon> <b>Away</b></v-chip
      >
      <v-chip label v-else
        ><v-icon left>mdi-access-point-off</v-icon> <b>Offline</b></v-chip
      >
    </template>
    <template #item.name="{ item }">
      <b>{{ item.first_name }} {{ item.last_name }}</b>
    </template>
    <template #item.memid="{ item }">
      <b>{{ item.memid }}</b>
    </template>
    <template #item.phone="{ item }">
      <b>{{ item.phone | VMask("###-###-####") }}</b>
    </template>
    <template #item.roles="{ item }">
      <!-- <v-chip dark color="red" class="font-weight-bold">{{
        item.roles
      }}</v-chip> -->
      <v-select
        :items="filteredRoles"
        label="Role"
        :value="item.roles"
        :disabled="filteredRoles.length <= 1"
        @change="
          update(item, {
            roles: $event,
          })
        "
        :loading="application.loading"
      ></v-select>
    </template>
    <template #item.iat="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-chip label color="teal accent-4" dark v-bind="attrs" v-on="on">
            <v-icon left>mdi-clock</v-icon
            ><b>{{ $moment(new Date(item.iat)).fromNow() }}</b></v-chip
          >
        </template>
        <span>{{ new Date(item.iat) }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-chip label color="orange lighten-3" dark v-bind="attrs" v-on="on">
            <v-icon left>mdi-clock</v-icon
            ><b>{{ $moment(new Date(item.uat)).fromNow() }}</b></v-chip
          >
        </template>
        <span>{{ new Date(item.uat) }}</span>
      </v-tooltip>
    </template>
    <template #item.email="{ item }">
      <b>{{ item.email }}</b>
    </template>
    <template #item.image="{ item }" style="width: 20%">
      <v-avatar color="primary" size="32">
        <img :src="item.image" alt="John"
      /></v-avatar>
    </template>

    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Manage Member</v-toolbar-title>
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
              :loading="application.loading"
            >
              <v-icon left>mdi-notebook-edit-outline</v-icon> New Member
            </v-btn>
            <v-btn
              dark
              class="mb-2 ml-4"
              v-bind="attrs"
              @click="deleteSelected"
              :disabled="!selected[0]"
              :loading="application.loading"
            >
              <v-icon left>mdi-trash-can</v-icon>
              Delete {{ selected.length }} items
            </v-btn>
          </template>

          <v-card height="100%" style="overflow: hidden">
            <v-card-title>
              <span class="headline"
                ><v-icon left>mdi-account-edit</v-icon>{{ formTitle }}</span
              >
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-container>
                <v-row>
                  <!-- fake out !!!!-->
                  <v-col cols="6" sm="12" md="6">
                    <v-text-field
                      v-model="editedItem.username"
                      label="Username"
                      prepend-inner-icon="mdi-account-box"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6" sm="12" md="6">
                    <v-text-field
                      v-model="editedItem.password"
                      label="Password"
                      type="password"
                      prepend-inner-icon="mdi-shield-key"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-select
                      v-model="editedItem.roles"
                      :items="filteredRoles"
                      label="Role"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions class="pb-5">
              <v-spacer></v-spacer>

              <v-btn color="blue darken-1" dark @click="reveal = true">
                <v-icon left>mdi-arrow-right-bold</v-icon> Next step
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="reveal = dialog = false"
              >
                <!-- <v-icon left>mdi-arrow-right-bold</v-icon> -->
                Cancel
              </v-btn>
            </v-card-actions>
            <v-expand-transition>
              <v-card
                v-if="reveal"
                class="transition-fast-in-fast-out v-card--reveal"
                style="height: 100%"
              >
                <v-card-text class="pb-0">
                  <v-row>
                    <v-col cols="6" sm="12" md="6">
                      <v-text-field
                        v-model="editedItem.first_name"
                        label="First Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="12" md="6">
                      <v-text-field
                        v-model="editedItem.last_name"
                        label="Last Name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.phone"
                        label="Phone Number"
                        v-mask="'###-###-####'"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="6">
                      <v-text-field
                        v-model="editedItem.email"
                        label="Email"
                        type="email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="6">
                      <v-select
                        v-model="editedItem.gender"
                        :items="['Not Mentioned', 'Male', 'Female']"
                        label="Gender"
                      ></v-select>
                    </v-col>
                    <v-col cols="6" sm="6" md="6">
                      <v-file-input
                        chips
                        counter
                        show-size
                        truncate-length="15"
                        label="Upload the product image"
                        accept="image/png, image/jpeg, image/bmp"
                        v-model="editedItem.file"
                      ></v-file-input> </v-col
                  ></v-row>
                </v-card-text>
                <v-card-actions class="pb-5">
                  <v-btn text color="primary" @click="reveal = false">
                    <v-icon left>mdi-arrow-left-bold</v-icon>
                    Previous step
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="teal" dark @click="insert()">
                    <v-icon left>mdi-content-save</v-icon>
                    Save
                  </v-btn>
                  <v-btn text @click="reveal = dialog = false"> Calcel </v-btn>
                </v-card-actions>
              </v-card>
            </v-expand-transition>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
        :disabled="application.loading"
      >
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)" :disabled="application.loading">
        mdi-delete
      </v-icon>
    </template>
    <!-- <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template> -->
  </v-data-table>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { nanoid } from "nanoid";
import qs from "qs";
export default {
  props: {
    tab: Number,
  },
  data: () => ({
    selected: [],
    search: "",
    dialog: false,
    dialogDelete: false,
    reveal: false,
    headers: [
      {
        text: "#ID",
        value: "id",
        align: "center",
        sortable: true,
        width: "4%",
      },
      {
        text: "Status",
        value: "status",
        align: "center",
        sortable: false,
        width: "4%",
      },
      {
        text: "Picture",
        value: "image",
        align: "center",
        sortable: false,
        width: "4%",
      },
      {
        text: "Firstname-Lastname",
        align: "start",
        sortable: true,
        value: "name",
      },
      {
        text: "Role",
        align: "start",
        sortable: true,
        value: "roles",
      },
      { text: "Phone", value: "phone", sortable: true, width: "10%" },
      { text: "Email", value: "email", sortable: true },
      { text: "Created/Updated at", value: "iat", sortable: true },
      { text: "Actions", value: "actions", sortable: false },
    ],
    editedIndex: -1,
    editedItem: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      image: "",
      roles: "Member",
      gender: "Not Mentioned",
      username: "",
      password: "",
      file: null,
    },
    defaultItem: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      image: "",
      roles: "Member",
      username: "",
      password: "",
      gender: "Not Mentioned",
      file: null,
    },
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Member" : "Edit Member";
    },
    ...mapFields([
      "products",
      "header",
      "checkout",
      "members",
      "roles",
      "auth",
      "application",
    ]),
    filteredMembers() {
      return this.members.filter(
        (member) => member.memid != this.auth.user.memid
      );
    },
    filteredRoles() {
      var currentPriority =
        this.roles.find((r) => r.name.trim() === this.auth.user.roles.trim())
          ?.priority || 0;
      console.log(currentPriority);
      return this.roles
        .filter((r) => r.priority <= currentPriority)
        .map((r) => r.name.trim());
    },
  },

  watch: {},

  created() {},

  methods: {
    editItem(item) {},
    save() {},
    async update(item, params) {
      try {
        await this.$store.dispatch("updateAccount", { params, id: item.uid });
      } catch (e) {}
    },
    async insert() {
      try {
        const file = this.editedItem.file;
        if (file == null)
          this.editItem.image = `https://i.pravatar.cc/150?u=${nanoid()}`;
        else {
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
          this.editedItem.image = preview;
          this.editedItem.file = null;
        }

        const params = {
          ...this.editedItem,
          confirmedPassword: this.editedItem.password,
        };

        const data = await this.$store.dispatch("register", params);
        this.$swal.fire({
          title: data.title,
          text: data.message,
          icon: data.error ? "error" : "success",
          timer: 1500,
        });
      } catch (e) {
        this.$swal("Opps, something went wrong!", e.message, "error");
      }
      this.reveal = false;
      this.dialog = false;
      this.editedItem = this.defaultItem;
    },
    async deleteItem(item) {
      console.log("deleting", item);
      this.$swal
        .fire({
          icon: "question",
          title: "Do you want to delete this member?",
          text: "You cannot undo the changes!",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: `Yes, please.`,
          cancelButtonText: `No, that was a mistake.`,
        })
        .then(async (result) => {
          /* Read more about isConfirmed, isDenied below */

          if (result.isConfirmed) {
            const data = await this.$store.dispatch("deleteAccount", item.uid);

            if (!data.error)
              this.$swal.fire(data.title, data.message, "success");
          } else if (result.isDenied) {
            this.$swal.fire(
              "Changes are not saved!",
              "Selected member wasn't deleted!",
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
          title: `Do you want to delete these ${selected.length} accounts?`,
          text: "You cannot undo the changes!",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: `Yes, please.`,
          cancelButtonText: `No, that was a mistake.`,
        })
        .then(async (result) => {
          /* Read more about isConfirmed, isDenied below */

          if (result.isConfirmed) {
            selected.forEach(async (account) => {
              const data = await this.$store.dispatch(
                "deleteAccount",
                account.uid
              );
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
  },
};
</script>

<style scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
