import Vue from 'vue'
import App from './App.vue'
import VueSocketio from 'vue-socket.io';
Vue.use(VueSocketio, 'http://schumacher.football:3000');

new Vue({
  el: '#app',
  render: h => h(App)
})
