<template>
  <v-container>
    <v-row dense justify="center">
      <v-col cols="6">
        <v-card flat>
          <v-row cols="12">
            <v-col cols="5"> <v-card-title class="headline"> Cloud Storage </v-card-title> </v-col>
            <v-spacer></v-spacer>
            <v-col cols="3" class="mr-4">
              <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on }">
               <v-btn dense class="ma-4" color="primary" v-on="on">Create New Folder</v-btn>
              </template>
              <v-card>
                <v-card-title>
                <span class="headline">Create New Folder</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem.name" label="Folder Name"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="close">Cancel</v-btn>
                <v-btn text @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row dense class="px-2 py-1">
            <v-col
            v-for="(item, i) in items"
            :key="i"
            cols="4"
            >
              <v-menu transition="slide-x-transition">
                <template v-slot:activator="{ on : menu }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-card
                      :color="item.color"
                      v-on="{ ...tooltip, ...menu }"
                      >
                      <div class="d-flex flex-no-wrap justify-space-between">
                        <div>
                          <v-card-title
                          class="headline"
                          v-text="item.name"
                          ></v-card-title>

                          <v-card-subtitle v-text="item.artist"></v-card-subtitle>
                        </div>

                        <v-avatar
                        class="ma-3"
                        size="100"
                        tile
                        >
                          <v-img
                          src='..\assets\folder-icon.png'
                          contain></v-img>
                        </v-avatar>
                      </div>
                      </v-card>
                    </template>
                    <span> {{ item.name }} </span>
                  </v-tooltip>

                </template>
                <v-list>
                  <v-list-item
                  v-for="(item, index) in items2"
                  :key="index"
                  dense
                  >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

            </v-col>
          </v-row>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase';
var bingka = 'api/';
var insert = 'insert/';

export default {
  name: 'HelloWorld',

  data: () => ({
    dialog: false,
    editedIndex: -1,
    items: [ {name: "1", src: "..\assets\folder-icon.png", artist: "0 documents"},
    ],

    items2: [
      { title: 'Open Folder' },
      { title: 'Rename Folder' },
    ],
    editedItem: {
      name: '',
    },
    defaultItem: {
      name: '',
    },
  }),

  watch: {
    dialog(val){
      val || this.close
    },
  },

  async created() {
    var item = this.items;
    await fetch(bingka)
    .then(function(response) {
      console.log('agi1');
      return response.json();
    })
    .then(function(myJson) {
      console.log(myJson);
      item = myJson
    });
    this.items = item
    console.log(item)
  },

  methods: {
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);

    },

    async save() {
      if (this.editedIndex > -1) {
        console.log('insert2')
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        console.log('insert')
        var item = this.editedItem;
        await fetch(insert, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(item)
        })
        .then(function(response) {
          console.log('agi1');
          return response.json();
        })
        .then(function(myJson) {
          console.log(myJson);
          item = myJson
        });
        this.items = item
        console.log(item)
        }
      this.close()
    },
  },
};


</script>
