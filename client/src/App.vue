<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-img
        class="mr-2"
        max-height="40"
        max-width="40"
        contain
        src="./assets/nia-logo.png">
      </v-img>
      <v-toolbar-title>Data Bank - ( Prototype )</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu
          left
          bottom
      >
      <template v-slot:activator="{ on }">
      <v-btn icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
      </template>

      <v-list>
      <v-list-item
          v-for="n in 1"
          :key="n"
          dense
      >
          <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
      </v-list>
      </v-menu>
    </v-app-bar>
    
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>



<script>
import Home from './views/Home.vue';

export default {
  name: 'App',

  components: {
    Home,
  },

  data: () => ({
    //
  }),
};
</script>
