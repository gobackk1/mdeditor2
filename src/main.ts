import firebase from 'firebase'
import router from './router'
import store from './store/store'
import App from './App.vue'
import Vue from 'vue'

Vue.config.productionTip = false

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDDuaRSPl3JR1B-bs4nN4vWJ5N2NVLdnf4',
  authDomain: 'mdeditor-f61ce.firebaseapp.com',
  databaseURL: 'https://mdeditor-f61ce.firebaseio.com',
  projectId: 'mdeditor-f61ce',
  storageBucket: 'mdeditor-f61ce.appspot.com',
  messagingSenderId: '262114995591',
  appId: '1:262114995591:web:ee67bcb1391022cbecf722',
  measurementId: 'G-JHK1SNQMXK',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
