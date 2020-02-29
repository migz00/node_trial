<template>
  <v-container>
    <v-row dense justify="center">
      <v-col cols="6">
        <v-card flat>
          <v-row cols="12">
            <v-col cols="5"> <v-card-title class="headline"> Cloud Storage </v-card-title> </v-col>
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
                          :src="item.src"
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
export default {
  name: 'HelloWorld',

  data: () => ({
    dialog: false,
    editedIndex: -1,
    items: [
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

  methods: {
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.items[this.editedIndex], this.editedItem);
      } else {
        db.collection('folders').doc(this.editedItem.name).set({
          name: this.editedItem.name,
        })
          .then(function() {
          console.log("Document successfully written!");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
        }
      this.close()
    },
  },
};
var firebaseConfig = {
          apiKey: "AIzaSyDierVYyjrZIoqMh7qY3JiHL1XNY7zjV2Y",
          authDomain: "data-bank-nia.firebaseapp.com",
          databaseURL: "https://data-bank-nia.firebaseio.com",
          projectId: "data-bank-nia",
          storageBucket: "data-bank-nia.appspot.com",
          messagingSenderId: "551196353265",
          appId: "1:551196353265:web:8aa98b78f9ad351d167f50"
          };
          // Initialize Firebase
          firebase.initializeApp(firebaseConfig);
          var db = firebase.firestore();
          var storageRef = firebase.storage().ref();
          console.log("agi1");    
          
   db.collection("folders").onSnapshot(function(querySnapshot) {
      var count = 0;
      var items = [];
      querySnapshot.forEach(function(doc) {
        var data = doc.data();
        data.src = 'folder-icon.png';
        data.artist = '0 documents';
        data.color = '#FFFFFF';
        items.push(data);
        count++;
      });
      console.log(items);
  });

</script>
