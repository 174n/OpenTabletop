import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import VueFire from 'vuefire'
import Firebase from 'firebase'

import App from './App.vue'
import Routes from './routes'
import store from './store'


Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(VueMaterial);
Vue.use(VueFire);

const router = new VueRouter({
    routes: Routes
});

Vue.material.registerTheme('default', {
  primary: 'blue',
  accent: 'red',
  warn: 'orange',
  background: 'white'
})

new Vue({
  el: '#app',
  render: h => h(App),
  router: router,
  store,
  data () {
    return {
      
    }
  }
});