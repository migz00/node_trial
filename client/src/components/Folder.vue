<template>
  <v-container fluid>
                <v-row dense justify="center">
                    <v-col cols="6">
                        <v-card flat>
                            <v-row cols="12">
                                <v-col cols="3"> 
                                    <v-card-title class="headline"> 
                                            {{ this.$route.params.folder }}
                                    </v-card-title> </v-col>
                                <v-spacer></v-spacer>
                                <v-col cols="3" class="mr-4">
                                    <v-dialog v-model="dialog" max-width="500px">
                                        <template v-slot:activator="{ on }">
                                            <v-btn dense class="ma-4" color="primary" v-on="on">Upload a New File</v-btn>
                                        </template>
                                        <v-card>
                                          <v-card-title>
                                            <span class="headline">Create a New File</span>
                                          </v-card-title>
                              
                                          <v-card-text>
                                            <v-container>
                                              <v-row>
                                                <v-col cols="12">
                                                    <v-select
                                                        v-model="editedItem.year"
                                                        :items="years"
                                                        label="Select Year"
                                                        dense
                                                    >
                                                    </v-select>
                                                    <v-select
                                                        v-model="editedItem.province"
                                                        :items="provinces"
                                                        label="Select Province"
                                                        dense
                                                        solo
                                                    >
                                                    </v-select>
                                                    <v-file-input v-model="editedItem.file" accept=".pdf" label="Choose a File"></v-file-input>
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
                                  </v-menu>
                                    
                                  </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                    
                </v-row>
            </v-container>
</template>

<script>
import Swal from 'sweetalert2'
var ups = 'upload/';

export default {
  name: 'Folder',

  data: () => ({
            dialog: false,
            editedIndex: -1,
            folderPath: '',
            items: [],
            folders: [],
            years: [],
            provinces: [
                { value: 'CATEEL', text: 'CATEEL' },
                { value: 'LUPON', text: 'LUPON' },
                { value: 'SANJOSE', text: 'SAN JOSE' },
                { value: 'LAUNION', text: 'LA UNION' },
            ],
            editedItem: {
                year: '',
                province: '',
                file: null
            },
            defaultItem: {
                year: '',
                province: '',
                file: null
            },
        }),

        watch: {
            dialog (val) {
                val || this.close()
            },
        },

        async created() {
            var ret = 'documents/'+this.$route.params.folder;
            var item;
            await fetch(ret)
            .then(function(response) {
                return response.json();
            })
            .then(function(myJson) {
                console.log(myJson);
                item = myJson
            });
            this.items = item

            console.log(item)
            var currentYear = new Date().getFullYear(), list = [];
            console.log(currentYear)
            var startYear = 2000;  
            while ( startYear <= currentYear ) {
                console.log(startYear)
                list.push({text: startYear, value: startYear});
                startYear++;
            }
            this.years = list;
        },

        methods: {
            close () {
                this.dialog = false
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },

            async save () {
                const form = new FormData();
                if (this.editedIndex > -1) {
                    Object.assign(this.items[this.editedIndex], this.editedItem)
                } else {
                    // db.collection("folders").doc(this.editedItem.name).set({
                    //     name: this.editedItem.name
                    // })
                    // .then(function() {
                    //     console.log("Document successfully written!");
                    // })
                    // .catch(function(error) {
                    //     console.error("Error writing document: ", error);
                    // });
                    //-------
                    Swal.fire({
                        title: 'Uploading...',
                        allowOutsideClick: false,
                        onBeforeOpen: () => {
                        Swal.showLoading()
                        }
                    });

                    form.append('file', this.editedItem.file);
                    form.append('year', this.editedItem.year);
                    form.append('province', this.editedItem.province);
                    form.append('folder', this.$route.params.folder);

                    console.log("agi2");
                    console.log(form)
                    await fetch(ups, {
                        method: 'POST',
                        header : {
                            "Content-Type" : "multipart/form-data"
                        },
                        body: form
                    })
                    .then(function(response) {
                        console.log('agi1');
                        return response.json();
                    })
                    .then(function(myJson) {
                        console.log(myJson);
                        console.log("Document successfully written!");
                        Swal.fire({
                            title: 'Your file has been uploaded',
                            html: '<a href="'+ myJson.url +'">Click to View File</a>',
                            icon: 'success',
                            allowOutsideClick: false
                        });
                    });
                    // Push to child path.
                    // [START oncomplete]
                    // storageRef.child('nia/' + this.editedItem.year + this.editedItem.province).put(this.editedItem.file, metadata).then(function(snapshot) {
                    //     console.log('Uploaded', snapshot.totalBytes, 'bytes.');
                    //     console.log('File metadata:', snapshot.metadata);
                    //     // Let's get a download URL for the file.
                    //     snapshot.ref.getDownloadURL().then(function(url) {
                    //     var id = this.editedItem.year+"-"+this.editedItem.province;
                    //     db.collection("nia").doc(id).set({
                    //         year: this.editedItem.year,
                    //         province: this.editedItem.province,
                    //         link: url
                    //     })
                    //     .then(function() {
                    //         console.log("Document successfully written!");
                    //         Swal.fire({
                    //             title: 'Your file has been uploaded',
                    //             icon: 'success',
                    //             allowOutsideClick: false
                    //         });
                    //         //TO-DO Insert to firebase firestore 
                    //         console.log('File available at', url);
                    //         // [START_EXCLUDE]
                            
                    //         // [END_EXCLUDE]
                    //     })
                    //     .catch(function(error) {
                    //         console.error("Error writing document: ", error);
                    //     });
                    //     });
                    // }).catch(function(error) {
                    //     // [START onfailure]
                    //     console.error('Upload failed:', error);
                    //     // [END onfailure]
                    // });
                    // [END oncomplete]
                }
                    //-------
                this.close()
            },
        },

};


</script>
