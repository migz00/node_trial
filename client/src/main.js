import Vue from 'vue';
import firebase from 'firebase';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;


// var db = firebase.firestore();
// var storageRef = firebase.storage().ref();

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
